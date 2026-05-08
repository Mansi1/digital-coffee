# Auth-Flow

Das System hat zwei getrennte Auth-Flows: einen einfachen Kiosk-Flow ohne Session und einen JWT-basierten Admin-Flow.

---

## Kiosk — Bestellung mit PIN

Kein Login, keine Session. Der Mitarbeiter identifiziert sich direkt beim Aufgeben der Bestellung per `employeeId` und `pin`.

```
Client                          Server
  │                               │
  │  POST /kiosk/orders           │
  │  { employeeId, pin, orders }  │
  │  ────────────────────────►    │ 1. Zod-Validierung
  │                               │ 2. Employee per ID suchen
  │                               │ 3. PIN mit argon2 prüfen
  │                               │ 4. Produkte suchen, Preise berechnen
  │  201 { data: orders }         │
  │ ◄──────────────────────────── │ 5. Bestellungen zurück (kein Cookie)
```

### Request

```http
POST /kiosk/orders
Content-Type: application/json

{
  "employeeId": "01JX...",
  "pin": "22222",
  "orders": [
    { "productId": "01JX...", "amount": 1 }
  ]
}
```

### Response `201`

```json
{
  "data": [
    {
      "id": "01JX...",
      "employeeId": "01JX...",
      "productId": "01JX...",
      "amount": 1,
      "price": 0.80,
      "createdAt": "2026-05-08T10:00:00.000Z"
    }
  ]
}
```

### Fehlercodes

| Status | Grund |
| ------ | ----- |
| `400`  | Fehlende oder ungültige Felder |
| `401`  | Employee nicht gefunden oder PIN falsch |
| `404`  | Produkt nicht gefunden |

::: info Sicherheit
Beide Fehlerfälle (nicht gefunden + falscher PIN) geben dieselbe Meldung `"Invalid credentials"` zurück — kein Enumeration-Angriff möglich.
:::

---

## Admin — JWT-Login

```
Client                          Server
  │                               │
  │  POST /admin/auth/login       │
  │  { employeeId, pin }  ──────► │ 1. Zod-Validierung
  │                               │ 2. Employee suchen
  │                               │ 3. PIN prüfen (argon2)
  │                               │ 4. Rolle prüfen → muss ADMIN sein
  │                               │ 5. JWT signieren (8h)
  │  200 + Set-Cookie: token=...  │
  │ ◄──────────────────────────── │ 6. HttpOnly-Cookie setzen
  │                               │
  │  GET /admin/auth/info         │
  │  Cookie: token=...    ──────► │ 7. jwtAuth-Middleware: Cookie auslesen
  │                               │ 8. JWT verifizieren → user ins Context
  │                               │ 9. requireAuth: user vorhanden?
  │  200 { data: admin }          │
  │ ◄──────────────────────────── │ 10. Admin-Daten zurück
```

### Login-Request

```http
POST /admin/auth/login
Content-Type: application/json

{
  "employeeId": "01JX...",
  "pin": "11111"
}
```

### Login-Response `200`

```json
{
  "data": {
    "id": "01JX...",
    "email": "a.bauer@bayernsoft.de",
    "role": "ADMIN",
    "companyId": "01JX..."
  }
}
```

Cookie wird automatisch gesetzt:
```
Set-Cookie: token=eyJ...; HttpOnly; SameSite=Strict; Max-Age=28800
```

### Fehlercodes Login

| Status | Grund |
|--------|-------|
| `400` | Fehlende oder ungültige Felder |
| `401` | Employee nicht gefunden oder PIN falsch |
| `403` | Employee existiert, hat aber keine ADMIN-Rolle |

---

## Session prüfen — `/admin/auth/info`

Das Frontend ruft diese Route beim Start auf, um zu prüfen ob der Admin noch eingeloggt ist.

```http
GET /admin/auth/info
Cookie: token=eyJ...
```

```json
{
  "data": {
    "id": "01JX...",
    "email": "a.bauer@bayernsoft.de",
    "role": "ADMIN",
    "companyId": "01JX..."
  }
}
```

- `200` → eingeloggt, im Dashboard bleiben
- `401` → nicht eingeloggt, zur Login-Seite weiterleiten

---

## Logout

```http
POST /admin/auth/logout
```

Löscht das Cookie mit `Max-Age=0`. Danach gibt `/admin/auth/info` wieder `401` zurück.

---

## JWT-Middleware (`jwtAuth`)

Läuft auf allen `/admin/*`-Routen (registriert in `src/app.ts`):

```
Eingehender Request an /admin/*
  │
  ├─ Cookie "token" vorhanden?
  │   ├─ Nein → weiter (user = undefined)
  │   └─ Ja → JWT verifizieren
  │       ├─ ungültig/abgelaufen → weiter (user = undefined)
  │       └─ gültig → c.set('user', payload)
  │
  └─ next()
```

Die `requireAuth`-Middleware auf geschützten Routen prüft dann ob `c.get('user')` gesetzt ist — falls nicht → `401`.

---

## Relevante Dateien

| Datei | Zweck |
|-------|-------|
| `src/features/admin/auth/controller.ts` | JWT signieren, Cookie setzen/löschen |
| `src/features/admin/auth/service.ts` | DB-Abfrage, PIN-Prüfung, Rollen-Check |
| `src/features/admin/auth/routes.ts` | `/login`, `/info`, `/logout` |
| `src/features/auth/controller.ts` | Kiosk-Identify Controller |
| `src/features/auth/service.ts` | `identifyEmployee()` |
| `src/middleware/jwt-auth.ts` | Cookie auslesen, JWT verifizieren |
| `src/middleware/require-auth.ts` | Prüft ob User im Context vorhanden |
