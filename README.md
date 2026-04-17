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
