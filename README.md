# NIGHTSHIFT — Install on your OPPO

## What you have
```
nightshift/
├── index.html       (the app)
├── manifest.json    (PWA config)
├── sw.js            (offline support)
├── icon.svg         (master logo)
├── icon-192.png     (home screen icon)
├── icon-512.png     (splash screen)
└── icon-180.png     (Apple touch icon)
```

## Install on your phone in 60 seconds (easiest path: Vercel)

You already deploy Webverse sites. Same drill:

### Option A — Vercel CLI (from your Lubuntu laptop)
```bash
cd ~/Downloads/nightshift    # wherever you unzip this
npx vercel --prod
```
First time it'll ask to log in (GitHub). Then it gives you a URL like `nightshift-kapil.vercel.app`.

### Option B — Vercel drag-and-drop
1. Go to https://vercel.com/new
2. Drag the `nightshift` folder onto the page
3. Click Deploy
4. Copy the URL

### Option C — Netlify drag-and-drop (no account needed for preview)
1. Go to https://app.netlify.com/drop
2. Drag the `nightshift` folder
3. Copy the URL

## Install on home screen

1. Open the URL in **Chrome** on your OPPO A5s
2. You'll see an "Install app" banner at the top of the page (orange)
3. Tap **Install**
4. OR: Chrome menu (⋮) → "Install app" / "Add to Home screen"

App icon appears on home screen. Tap it → opens fullscreen, no browser UI, works offline.

## What's new in this version
- **Live clock** at the top (date + 24h time, updates every 30s)
- **Window indicator** — shows "IN WINDOW" (orange pulse) between 8:30–10:45 PM, otherwise counts down "2H 15M TO GO"
- **Auto day rotation** — opens the right subject every night based on the real date
- **Vibration** on sprint completion (if your phone supports it)
- **Installable PWA** with offline support
- **Proper logo** — crescent moon with orange streak
- **BEASTMODE** — exam-crunch protocol: 50-min sprints, 3-min breaks, 4 required, task must be typed before Start, reset locked mid-sprint, red theme, streak-at-risk warning after 8:30 PM if untouched

## BEASTMODE
Tap the BEASTMODE toggle above the timer. When engaged:
- Focus sprints grow to **50 min**, breaks shrink to **3 min** (long break 10 min every 4th).
- All **4 sprints are mandatory** (no "bonus" slot).
- **Task input is required** before every focus sprint — Start does nothing until you name it.
- **Reset is locked** while a focus sprint is running. You finish what you start.
- **Pause is locked** during focus. Lock-in means lock-in.
- Completing the required sprints **auto-checks** the day on the week tracker.
- **Streak-at-risk** banner flashes red past 8:30 PM if tonight isn't checked yet.
- Your preference persists across reboots.

## If it doesn't offer Install
- Must be served over HTTPS (all three options above do this automatically)
- Must open in Chrome, not Samsung Internet or in-app browser
- Close and reopen Chrome once after visiting the URL

## Data
Everything saves to your phone's localStorage. Survives reboots, app closes, offline.
Clearing Chrome data for that site wipes it.

Auto-deploy connected via GitHub → Vercel.
