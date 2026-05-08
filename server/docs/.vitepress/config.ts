import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    server: {
      host: '0.0.0.0',
    },
  },
  title: 'Digital Coffee',
  description: 'REST API Dokumentation — Kiosk, Admin & Bestellungen',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Kiosk', link: '/kiosk' },
      { text: 'Admin', link: '/admin' },
    ],

    sidebar: [
      {
        text: 'Routen',
        items: [
          { text: 'Kiosk', link: '/kiosk' },
          { text: 'Admin', link: '/admin' },
        ],
      },
      {
        text: 'Konzepte',
        items: [
          { text: 'Auth-Flow', link: '/login' },
          { text: 'Datenmodell', link: '/datenmodell' },
        ],
      },
      {
        text: 'Konfiguration',
        items: [{ text: 'Env-Validierung', link: '/env-validierung' }],
      },
    ],

    socialLinks: [],
  },
})
