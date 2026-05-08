# Login & Authentifizierung

Diese Seite erklärt den kompletten Auth-Flow: von der HTTP-Anfrage bis zum gesetzten Cookie und wie nachfolgende Requests damit abgesichert werden.

---

## Übersicht

```
Client                          Server
  │                               │
  │  POST /auth/login             │
  │  { email, password }  ──────► │ 1. Validierung (Zod)
  │                               │ 2. User in DB suchen
  │                               │ 3. Passwort prüfen (argon2)
  │                               │ 4. JWT signieren
  │  200 + Set-Cookie: token=...  │
  │ ◄──────────────────────────── │ 5. Cookie setzen
  │                               │
  │  GET /todos                   │
  │  Cookie: token=...    ──────► │ 6. Cookie auslesen (jwtAuth)
  │                               │ 7. JWT verifizieren → user ins Context
  │                               │ 8. Permission prüfen
  │  200 { data: [...] }          │
  │ ◄──────────────────────────── │ 9. Response
```

---

## Schritt für Schritt

### 1. Route — `POST /auth/login`

**Datei:** `src/features/auth/routes.ts`

Der Client sendet E-Mail und Passwort als JSON-Body:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

Die Route ist in der `Routes`-Klasse registriert und hat ein OpenAPI-Schema hinterlegt. Bevor der Controller aufgerufen wird, validiert Hono automatisch den Body gegen das `AuthBodySchema`.

---

### 2. Validierung — `AuthBodySchema`

**Datei:** `src/features/auth/schema.ts`

```ts
const AuthBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})
```

Schlägt die Validierung fehl (z. B. keine gültige E-Mail, Passwort zu kurz), antwortet die API direkt mit **400 Bad Request** — der Controller wird nicht erreicht.

---

### 3. Service — Datenbankabfrage & Passwortprüfung

**Datei:** `src/features/auth/service.ts`

```
AuthService.login(email, password)
  │
  ├─ User per E-Mail in der DB suchen
  │   └─ nicht gefunden → 401 Unauthorized
  │
  └─ Passwort mit argon2 verifizieren
      └─ falsch → 401 Unauthorized
```

Das Passwort wird **niemals im Klartext** gespeichert. `argon2` ist ein moderner, sicherer Hashing-Algorithmus — `verify()` vergleicht das eingegebene Passwort mit dem gespeicherten Hash.

Beide Fehler (User nicht gefunden & falsches Passwort) geben dieselbe Meldung `"Invalid credentials"` zurück, damit kein Angreifer herausfinden kann, ob eine E-Mail existiert.

---

### 4. Controller — JWT erstellen & Cookie setzen

**Datei:** `src/features/auth/controller.ts`

Nach erfolgreichem Login signiert der Controller ein JWT:

```ts
const token = await sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 Stunden
  },
  JWT_SECRET,
)
```

Das JWT enthält die User-ID, E-Mail und die Rolle. Es läuft nach **24 Stunden** ab.

Danach wird das Token als **HttpOnly-Cookie** gesetzt:

```ts
setCookie(c, 'token', token, {
  httpOnly: true,   // nicht per JavaScript auslesbar → XSS-Schutz
  secure: true,     // nur über HTTPS (in Produktion)
  sameSite: 'Strict', // kein Cross-Site-Sending → CSRF-Schutz
  maxAge: 3600 * 24,
})
```

Der Client bekommt den Token **nie direkt** zurück — nur im Cookie. Die Response enthält lediglich die öffentlichen User-Daten:

```json
{
  "data": {
    "id": "clxyz123",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

### 5. Folge-Requests — Cookie automatisch prüfen

**Datei:** `src/middleware/jwt-auth.ts`

Bei **jedem** Request läuft die `jwtAuth`-Middleware (registriert in `src/app.ts` via `app.use('*', jwtAuth)`):

```
Eingehender Request
  │
  ├─ Cookie "token" vorhanden?
  │   ├─ Nein → weiter (user = undefined im Context)
  │   └─ Ja → JWT verifizieren
  │       ├─ ungültig / abgelaufen → weiter (user = undefined, kein Fehler)
  │       └─ gültig → user ins Hono-Context setzen (c.set('user', payload))
  │
  └─ next() → Route-Handler
```

Die Middleware wirft bei einem ungültigen Token **keinen Fehler** — sie setzt einfach keinen User. Ob ein User erforderlich ist, entscheidet die Route selbst.

---

### 6. Geschützte Routen — `requireAuth`

**Datei:** `src/middleware/require-auth.ts`

Routen die einen eingeloggten User voraussetzen (z. B. `GET /auth/me`) nutzen die `requireAuth`-Middleware:

```ts
const user = c.get('user')
if (!user) return c.json({ error: 'UNAUTHORIZED' }, 401)
```

Sie liest einfach den User aus dem Context, den `jwtAuth` zuvor gesetzt hat.

---

### 7. Rollen & Permissions

**Datei:** `src/lib/permissions.ts`

Jeder User hat eine Rolle (`USER`, `ADMIN`, `NONE`). Rollen haben fest definierte Permissions:

| Rolle   | Permissions                                              |
|---------|----------------------------------------------------------|
| `USER`  | `todo:read`, `todo:write`                                |
| `ADMIN` | `todo:read`, `todo:write`, `todo:delete`, `user:read`, `user:manage` |
| `NONE`  | —                                                        |

Die Todos-Routen prüfen Permissions via `requirePermission`-Middleware. Fehlt die Permission → **403 Forbidden**.

---

## Logout

`POST /auth/logout` löscht das Cookie, indem es mit `maxAge: 0` überschrieben wird:

```ts
setCookie(c, 'token', '', { maxAge: 0 })
```

Der Client sendet das Cookie danach nicht mehr mit.

---

## Relevante Dateien

| Datei | Zweck |
|---|---|
| `src/features/auth/routes.ts` | Routen-Definition mit OpenAPI-Schema |
| `src/features/auth/controller.ts` | JWT signieren, Cookie setzen |
| `src/features/auth/service.ts` | DB-Abfrage, Passwort-Verifikation |
| `src/features/auth/schema.ts` | Zod-Validierungsschemas |
| `src/middleware/jwt-auth.ts` | Cookie auslesen, JWT verifizieren (global) |
| `src/middleware/require-auth.ts` | Prüft ob User im Context vorhanden |
| `src/lib/permissions.ts` | Rollen & Permission-Mapping |
