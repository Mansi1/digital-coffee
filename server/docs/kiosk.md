# Kiosk-Routen

Alle Kiosk-Routen sind **öffentlich** — kein JWT, kein Login erforderlich.

Basis-URL: `/kiosk`

---

## Mitarbeiter registrieren

```http
POST /kiosk/register
```

Legt einen neuen Mitarbeiter an. Der PIN ist optional — wird keiner angegeben, wird ein 5-stelliger PIN zufällig generiert.

**Body:**

```json
{
  "name": "Hans Müller",
  "email": "h.mueller@bayernsoft.de",
  "companyId": "01JX...",
  "pin": "54321"
}
```

**Response `201`:**

```json
{
  "data": {
    "id": "01JX...",
    "email": "h.mueller@bayernsoft.de",
    "role": "USER",
    "companyId": "01JX..."
  }
}
```

| Status | Grund |
| ------ | ----- |
| `400`  | Fehlende Felder, ungültige E-Mail, PIN nicht genau 5 Stellen |
| `404`  | Company nicht gefunden |
| `409`  | E-Mail bereits vergeben |

---

## Produkte abrufen

```http
GET /kiosk/products
```

Gibt alle aktiven Produkte zurück (`deactivatedAt = null`).

**Response `200`:**

```json
{
  "data": [
    { "id": "01JX...", "name": "Espresso", "price": 0.50, "deactivatedAt": null, "createdAt": "...", "updatedAt": "..." },
    { "id": "01JX...", "name": "Cappuccino", "price": 0.80, "deactivatedAt": null, "createdAt": "...", "updatedAt": "..." }
  ]
}
```

---

## Bestellung aufgeben

```http
POST /kiosk/orders
```

Identifiziert den Mitarbeiter per PIN und legt eine oder mehrere Bestellungen auf einmal an. Der Preis wird automatisch aus dem Produktpreis × Menge berechnet und auf 2 Dezimalstellen gerundet.

**Body:**

```json
{
  "employeeId": "01JX...",
  "pin": "22222",
  "orders": [
    { "productId": "01JX...", "amount": 2 },
    { "productId": "01JX...", "amount": 1 }
  ]
}
```

**Response `201`:**

```json
{
  "data": [
    {
      "id": "01JX...",
      "employeeId": "01JX...",
      "productId": "01JX...",
      "amount": 2,
      "price": 1.00,
      "createdAt": "2026-05-08T10:00:00.000Z"
    }
  ]
}
```

| Status | Grund |
| ------ | ----- |
| `400`  | Fehlende Felder, `amount` nicht positiv, PIN nicht genau 5 Stellen |
| `401`  | Employee nicht gefunden oder PIN falsch |
| `404`  | Product nicht gefunden |

---

## Mitarbeiterliste

```http
GET /kiosk/employees
```

Gibt alle aktiven Mitarbeiter (Name + Firma) zurück. Wird vom Frontend verwendet, damit der Mitarbeiter sich selbst auswählen kann.

**Response `200`:**

```json
{
  "data": [
    { "name": "Thomas Huber", "company": { "name": "BayernSoft GmbH" } }
  ]
}
```
