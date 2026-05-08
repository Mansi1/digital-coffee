# Umgebungsvariablen & Validierung

> [!TIP]
> Env-Variablen werden immer als String geladen. Zum Beispiel 3000 in env wird zur Laufzeit "3000"


## Warum validieren?

Umgebungsvariablen (`.env`-Werte) sind Strings ohne Typ-Garantie. Ohne Validierung bemerkt man fehlende oder falsch konfigurierte Werte erst zur Laufzeit – oft mitten in einem API-Fehler. Beim Serverstart werden die env Variablen validiert und geprüft.

---

## Wo liegt die relevante Datei?

```
src/config/
  env.ts   # Lädt .env, validiert mit Zod, exportiert typisiertes Objekt
```

---

## Validierungspunkt: Serverstart

`env.ts` lädt `.env` über `dotenv` und validiert `process.env` beim ersten Import des Moduls:

```ts
import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  DATABASE: z.url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.url(),
  PORT: z.coerce.number().default(3000),
})

const envServer = schema.safeParse(process.env)

if (!envServer.success) {
  console.error('❌ Ungültige Umgebungsvariablen:', envServer.error.message)
  process.exit(1)
}

export const env = envServer.data
```

Schlägt die Validierung fehl, gibt er die Fehlermeldung zurück und beendet der Prozess sofort mit `exit(1)`.


---

## Das Schema

```ts
// src/config/env.ts
import { z } from 'zod'

const schema = z.object({
  DATABASE: z.url(),                              // PostgreSQL Connection-URL
  JWT_SECRET: z.string().min(16),                 // Secret für JWT-Signierung (min. 16 Zeichen)
  CORS_ORIGIN: z.url(),                           // Erlaubter CORS-Origin (Frontend-URL)
  PORT: z.coerce.number().default(3000),          // HTTP-Port des Servers
})
```

`z.coerce.number()` konvertiert den String `"3000"` aus `.env` automatisch zur Zahl.

---

## Neue Variable hinzufügen

**1. Schema erweitern**

```ts
// src/config/env.ts
const schema = z.object({
  DATABASE: z.url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.url(),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'), // neu
})
```

**2. `.env` Datei befüllen**

```bash
# .env
DATABASE=postgresql://user:pw@localhost:5432/mydb
JWT_SECRET=supersecretkey1234567
CORS_ORIGIN=http://localhost:5173
PORT=3000
LOG_LEVEL=debug
```

**3. `.env.example` aktualisieren**

```bash
# .env.example
DATABASE="postgresql://USER:PW@DATENBANK:PORT/SCHEMA"
JWT_SECRET="JWT"
CORS_ORIGIN="http://localhost:5173"
PORT=3000
LOG_LEVEL=info
```

**4. Variable verwenden**

```ts
import { env } from './config/env.js'

if (env.LOG_LEVEL === 'debug') {
  // ...
}
```

---

## Fehlerbeispiel

Fehlt `JWT_SECRET` oder ist kürzer als 16 Zeichen, erscheint beim Start:

```
❌ Ungültige Umgebungsvariablen: [
  {
    "code": "too_small",
    "path": ["JWT_SECRET"],
    "message": "String must contain at least 16 character(s)"
  }
]
```

Der Server startet nicht.
