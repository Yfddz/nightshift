# BEASTMODE

Mobile-first gym workout tracker for a 5-day split. Single-page Next.js + Tailwind, deployed on Vercel.

## Stack

- Next.js 14 (App Router, client-only page)
- Tailwind CSS 3
- TypeScript
- `localStorage` — no backend

## Split

| Day | Focus               |
| --- | ------------------- |
| D1  | Chest + Tri         |
| D2  | Back + Bi           |
| D3  | Legs                |
| D4  | Shoulders + Arms    |
| D5  | Chest + Back Volume |

## Features

- 5-day split selector with full exercise lists hardcoded
- Log weight (kg) + reps per set, persisted to `localStorage`
- Rest timer (90s / 2:00 / 3:00) with vibration on completion
- **Ramp-up mode** — suggests 60% of last weight in Week 1, 75% in Week 2
- Auto week tracker from first launch
- Progressive overload hint per exercise vs. last session
- Export full history as JSON
- Brutalist/industrial dark UI, Archivo Black + JetBrains Mono, #ff3d00 accent
- Thumb-friendly: big tap targets, no hamburger menus

## Install on phone (PWA)

Once the preview / production URL is live on Vercel:

**Android (Chrome):**
1. Open the URL in Chrome
2. Chrome menu (⋮) → **Install app** (or "Add to Home screen")
3. Icon appears on home screen; tap to launch fullscreen, no browser chrome, works offline

**iOS (Safari):**
1. Open the URL in Safari (not Chrome — iOS requires Safari for home-screen install)
2. Share button → **Add to Home Screen**
3. Tap **Add**; launches fullscreen on next open

The app ships a manifest, 512×512 + 180×180 icons, and a service worker, so the install banner should appear automatically on Android after a first load. Data lives in `localStorage` and persists offline.

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npx vercel --prod
```

Vercel auto-detects Next.js. The `main` branch of this repo previously held the Nightshift static PWA — the git history is preserved there.
