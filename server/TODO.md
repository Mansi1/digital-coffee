# TODO — Digital Coffee Server

## Code-Bewertung

**Gesamtbewertung: 7/10**

### Stärken
- Saubere Feature-Struktur mit klarer Trennung (kiosk vs. admin)
- Konsistente Error-Handling Middleware
- Zod-Validierung an allen Route-Eingaben
- Argon2 für PIN-Hashing korrekt eingesetzt
- `deactivatedAt`-Pattern für Soft-Delete ist nachvollziehbar und auditierbar
- OpenAPI/Scalar-Dokumentation läuft out-of-the-box

### Schwächen
- Kiosk-Routen (employees, companies) sind öffentlich — kein Schutz
- Admin-Bereich hat noch keine echte JWT-Authorisierung auf allen Routen (GET /products offen)
- Testabdeckung lückenhaft — admin products, employee, company haben keine Tests
- Kein Export, keine History-Bereinigung

---

## Offene Routen & Logik

### Admin — Employee Management
- [ ] `GET    /admin/employees`         — alle Mitarbeiter auflisten (inkl. deaktivierte)
- [ ] `PATCH  /admin/employees/{id}`   — Name / Rolle ändern
- [ ] `DELETE /admin/employees/{id}`   — Mitarbeiter deaktivieren (`deactivatedAt = now()`)

### Admin — Company Management
- [ ] `GET    /admin/companies`         — alle Firmen auflisten
- [ ] `POST   /admin/companies`         — neue Firma anlegen
- [ ] `PATCH  /admin/companies/{id}`   — Firma bearbeiten
- [ ] `DELETE /admin/companies/{id}`   — Firma deaktivieren

### Admin — Order Management
- [ ] `GET    /admin/orders`            — alle Bestellungen (filter by date, employee, product)
- [ ] `GET    /admin/orders/stats`      — Auswertung: Top-Produkte, Umsatz pro Monat
- [ ] `DELETE /admin/orders/last-month` — alle Bestellungen des letzten Monats löschen (Bereinigung)
- [ ] `GET    /admin/orders/export`     — Bestellliste als CSV exportieren (mit Query-Parametern für Zeitraum)

### Kiosk
- [ ] `GET    /kiosk/orders/{employeeId}` — eigene Bestellhistorie eines Mitarbeiters

---

## Fehlende Tests

- [ ] `src/features/admin/product/test.ts` — GET, POST, PATCH, DELETE
- [ ] `src/features/admin/orders/test.ts`  — wenn Order-Management-Routen angelegt
- [ ] `src/features/employee/test.ts`      — wenn Admin-Employee-Routen angelegt

---

## Technische Schulden

- [ ] `requireAuth` auf `GET /admin/products` fehlt noch (aktuell öffentlich)
- [ ] Kiosk-Routen `/kiosk/employees` und `/kiosk/companies` absichern oder entfernen
- [ ] `src/features/auth/routes.ts` (die alte Datei) aufräumen — wird nicht mehr gemountet
- [ ] `src/test/helper.ts` — `getAuthCookie`-Funktion für USER-Rolle noch vorhanden aber unused
- [ ] Seed-Daten: `prisma/data/user.ts` (alte Datei) prüfen und ggf. löschen
