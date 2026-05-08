# Admin-Routen

Alle Admin-Routen sind **JWT-geschützt** — außer `/admin/auth/login`.

Basis-URL: `/admin`

---

## Auth

### Login

```http
POST /admin/auth/login
```

Prüft Employee-ID und PIN. Muss `ADMIN`-Rolle haben. Setzt JWT als HttpOnly-Cookie (8 Stunden).

**Body:**

```json
{
  "employeeId": "01JX...",
  "pin": "11111"
}
```

**Response `200`:**

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

| Status | Grund |
| ------ | ----- |
| `400`  | Fehlende oder ungültige Felder |
| `401`  | Employee nicht gefunden oder PIN falsch |
| `403`  | Employee existiert, hat aber keine `ADMIN`-Rolle |

---

### Session prüfen

```http
GET /admin/auth/info
```

Gibt den aktuell eingeloggten Admin zurück. Das Frontend ruft diese Route beim Start auf.

**Response `200`:**

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

| Status | Grund |
| ------ | ----- |
| `401`  | Kein gültiges JWT-Cookie vorhanden |

---

### Logout

```http
POST /admin/auth/logout
```

Löscht das JWT-Cookie (`Max-Age=0`). Danach gibt `/admin/auth/info` wieder `401` zurück.

**Response `200`:**

```json
{ "data": null }
```

---

## Produkte

### Alle Produkte

```http
GET /admin/products
```

Gibt alle Produkte zurück — auch deaktivierte (`deactivatedAt != null`).

**Response `200`:**

```json
{
  "data": [
    {
      "id": "01JX...",
      "name": "Espresso",
      "price": 0.50,
      "deactivatedAt": null,
      "createdAt": "2026-05-08T10:00:00.000Z",
      "updatedAt": "2026-05-08T10:00:00.000Z"
    },
    {
      "id": "01JX...",
      "name": "Alte Sorte",
      "price": 0.60,
      "deactivatedAt": "2026-04-01T08:00:00.000Z",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-04-01T08:00:00.000Z"
    }
  ]
}
```

---

### Produkt erstellen

```http
POST /admin/products
```

Legt ein neues Produkt an.

**Body:**

```json
{
  "name": "Flat White",
  "price": 1.00
}
```

**Response `201`:**

```json
{
  "data": {
    "id": "01JX...",
    "name": "Flat White",
    "price": 1.00,
    "deactivatedAt": null,
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z"
  }
}
```

| Status | Grund |
| ------ | ----- |
| `400`  | Fehlende Felder oder ungültiger Preis |
| `401`  | Nicht eingeloggt |

---

### Produkt aktualisieren

```http
PATCH /admin/products/:id
```

Ändert Name und/oder Preis eines Produkts.

**Body (alle Felder optional):**

```json
{
  "name": "Doppelter Espresso",
  "price": 0.80
}
```

**Response `200`:** Aktualisiertes Produkt (gleiche Struktur wie oben).

| Status | Grund |
| ------ | ----- |
| `400`  | Ungültige Daten |
| `401`  | Nicht eingeloggt |
| `404`  | Produkt nicht gefunden |

---

### Produkt deaktivieren

```http
DELETE /admin/products/:id
```

Setzt `deactivatedAt` auf den aktuellen Zeitstempel (Soft-Delete). Das Produkt taucht im Kiosk nicht mehr auf.

**Response `200`:**

```json
{ "data": null }
```

| Status | Grund |
| ------ | ----- |
| `401`  | Nicht eingeloggt |
| `404`  | Produkt nicht gefunden |
