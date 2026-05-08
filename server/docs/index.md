---
layout: home

hero:
  name: "Digital Coffee"
  text: "Server Dokumentation"
  tagline: REST API für das Kaffeekassen-System — Kiosk, Admin & Bestellungen
  actions:
    - theme: brand
      text: Kiosk-Routen
      link: /kiosk
    - theme: brand
      text: Admin-Routen
      link: /admin
    - theme: alt
      text: Datenmodell
      link: /datenmodell

features:
  - title: Kiosk
    details: Mitarbeiter identifizieren sich per PIN und bestellen Getränke. Öffentliche Routen, kein Login erforderlich.
  - title: Admin
    details: JWT-geschützter Bereich. Produkte verwalten, Bestellhistorie einsehen, Mitarbeiter deaktivieren.
  - title: Soft-Delete
    details: Statt isActive wird deactivatedAt verwendet — deaktivierte Einträge bleiben mit Zeitstempel erhalten.
---
