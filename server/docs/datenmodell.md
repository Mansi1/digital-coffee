# Datenmodell

## Überblick

```
Company
  └── Employee (n)
        └── Order (n)
                └── Product
```

Eine Firma (`Company`) hat mehrere Mitarbeiter (`Employee`). Jeder Mitarbeiter kann beliebig viele Bestellungen (`Order`) aufgeben. Jede Bestellung bezieht sich auf genau ein Produkt (`Product`).

---

## Company

| Feld            | Typ        | Beschreibung |
| --------------- | ---------- | ------------ |
| `id`            | `String`   | ULID, Primärschlüssel |
| `name`          | `String`   | Firmenname |
| `email`         | `String`   | Eindeutige E-Mail |
| `deactivatedAt` | `DateTime?` | Soft-Delete — `null` = aktiv |
| `createdAt`     | `DateTime` | Erstellt am |
| `updatedAt`     | `DateTime` | Zuletzt geändert |

---

## Employee

| Feld            | Typ        | Beschreibung |
| --------------- | ---------- | ------------ |
| `id`            | `String`   | ULID, Primärschlüssel |
| `name`          | `String`   | Vor- und Nachname |
| `email`         | `String`   | Eindeutige E-Mail |
| `pin`           | `String`   | Argon2-Hash des 5-stelligen PINs |
| `role`          | `Role`     | `USER` oder `ADMIN` |
| `companyId`     | `String`   | FK → Company |
| `deactivatedAt` | `DateTime?` | Soft-Delete — `null` = aktiv |
| `createdAt`     | `DateTime` | Erstellt am |
| `updatedAt`     | `DateTime` | Zuletzt geändert |

---

## Product

| Feld            | Typ        | Beschreibung |
| --------------- | ---------- | ------------ |
| `id`            | `String`   | ULID, Primärschlüssel |
| `name`          | `String`   | Produktname |
| `price`         | `Float`    | Preis in Euro |
| `deactivatedAt` | `DateTime?` | Soft-Delete — `null` = sichtbar im Kiosk |
| `createdAt`     | `DateTime` | Erstellt am |
| `updatedAt`     | `DateTime` | Zuletzt geändert |

---

## Order

| Feld         | Typ        | Beschreibung |
| ------------ | ---------- | ------------ |
| `id`         | `String`   | ULID, Primärschlüssel |
| `employeeId` | `String`   | FK → Employee |
| `productId`  | `String`   | FK → Product |
| `amount`     | `Int`      | Menge (≥ 1) |
| `price`      | `Float`    | Gesamtpreis (`productPrice × amount`, 2 Dezimalstellen) |
| `createdAt`  | `DateTime` | Bestellzeitpunkt |

---

## Soft-Delete mit `deactivatedAt`

Anstelle eines `isActive Boolean` wird `deactivatedAt DateTime?` verwendet:

- **`null`** → Eintrag ist aktiv
- **Zeitstempel** → Eintrag wurde zu diesem Zeitpunkt deaktiviert

Vorteile gegenüber `isActive`:

- Der Deaktivierungszeitpunkt ist direkt auswertbar (z. B. für Berichte)
- Kein separates `updatedAt` nötig um zu wissen, wann etwas deaktiviert wurde
- Konsistenter Abfrage-Pattern: `where: { deactivatedAt: null }` = alle aktiven Einträge

---

## Rollen

```
NONE  — Standardrolle bei Registrierung (noch nicht zugewiesen)
USER  — Mitarbeiter, kann Bestellungen aufgeben
ADMIN — Kann Produkte verwalten und hat Zugang zum Admin-Bereich
```

Admin-Login erfordert `role === 'ADMIN'`. Kiosk-Identify funktioniert für alle Rollen.
