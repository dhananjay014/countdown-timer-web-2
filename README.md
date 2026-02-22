# Countdown Timer Web App

A modern, feature-rich countdown timer application built with React, TypeScript, and Material Design. Track multiple timers simultaneously, count down to important events, use a stopwatch with lap tracking, and customize your experience with themes, audio alerts, and browser notifications.

**Live Demo:** [countdown-timer-web-2.vercel.app](https://countdown-timer-web-2.vercel.app)

## Tech Stack

![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite 7](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![MUI 7](https://img.shields.io/badge/MUI-7.3-007FFF?logo=mui)
![Zustand 5](https://img.shields.io/badge/Zustand-5.0-000000)

---

## Features

### Countdown Timers
- Create, edit, delete, and **duplicate** timers with independent controls
- Set hours, minutes, and seconds with intuitive inputs
- Full lifecycle: idle → running → paused → completed
- Visual **circular progress ring** showing remaining time
- Large HH:MM:SS display with smooth updates
- Up to **20 concurrent timers**
- Absolute-timestamp accuracy (survives tab sleep and page refresh)

### Quick-Start Presets
- One-click timer creation: **1, 5, 10, 15, 25, 30, 45 min, and 1 hour**
- Preset timers start immediately after creation
- Disabled when the 20-timer limit is reached

### Event Countdowns
- Count down to birthdays, holidays, releases, and custom dates
- **Smart adaptive formatting**:
  - `5m 30s` (under 1 hour)
  - `5h 30m` (under 24 hours)
  - `5d 3h` (under 7 days)
  - `45 days` / `3 months, 5 days` (longer durations)
- Live updates every second
- Up to **50 event countdowns**

### Stopwatch with Lap Tracking
- Start, pause, resume, and reset
- **Centisecond precision** (MM:SS.cs or HH:MM:SS.cs)
- Record laps while running
- **Best and worst lap highlighting** (green / red) when 2+ laps exist
- Scrollable lap list with split times

### Audio Alarms
- Built-in synthesized 800 Hz sine wave via **Web Audio API** (no external files)
- Configurable volume (0–100%)
- Enable/disable toggle without affecting timer operation
- Audio preferences persist across sessions

### Browser Notifications
- Native **Notification API** integration
- Fires when a timer completes while the tab is hidden
- One-click permission request from Settings
- Respects browser-level permission state (shows "blocked" hint if denied)

### Theme Support
- **Light**, **Dark**, and **System** (auto-detect) modes
- Material Design 3 styling throughout
- Smooth theme transitions
- Responsive layout for mobile, tablet, and desktop

### Settings Dialog
- Theme selector (Light / System / Dark toggle group)
- Sound on/off switch
- Volume slider (0–100%)
- Browser notifications toggle with permission handling

### Persistence
- All timers, events, and settings saved to **localStorage**
- Changes persist instantly — survives page refresh
- Full offline functionality (client-side only, no server required)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
git clone https://github.com/yourusername/countdown-timer-web-2.git
cd countdown-timer-web-2
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with Hot Module Replacement.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Lint with ESLint |
| `npm run preview` | Preview production build locally |

---

## Project Structure

```
countdown-timer-web-2/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppBar.tsx            # Top bar with settings icon
│   │   │   ├── AppLayout.tsx         # Main layout wrapper
│   │   │   └── Navigation.tsx        # Tab navigation (Timers / Events / Stopwatch)
│   │   ├── timers/
│   │   │   ├── TimerCard.tsx         # Individual timer with progress ring & controls
│   │   │   ├── TimerList.tsx         # Timer list container
│   │   │   ├── TimerForm.tsx         # Create/edit timer dialog
│   │   │   ├── TimerPresets.tsx      # Quick-start preset chips
│   │   │   └── ProgressRing.tsx      # Circular progress visualization
│   │   ├── events/
│   │   │   ├── EventCard.tsx         # Individual event display
│   │   │   ├── EventList.tsx         # Event list container
│   │   │   ├── EventEditDialog.tsx   # Create/edit event dialog
│   │   │   ├── CountdownDisplay.tsx  # Smart time formatting
│   │   │   └── EmptyEventState.tsx   # Empty state message
│   │   ├── stopwatch/
│   │   │   ├── Stopwatch.tsx         # Stopwatch display and controls
│   │   │   └── LapList.tsx           # Lap table with best/worst highlighting
│   │   ├── settings/
│   │   │   └── SettingsDialog.tsx    # Theme, sound, volume, notifications
│   │   └── common/
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ConfirmDialog.tsx
│   ├── stores/
│   │   ├── timersStore.ts            # Timer state + actions (Zustand + persist)
│   │   ├── eventsStore.ts            # Event state + actions (Zustand + persist)
│   │   ├── settingsStore.ts          # Settings state + actions (Zustand + persist)
│   │   └── stopwatchStore.ts         # Stopwatch state + actions (Zustand, not persisted)
│   ├── hooks/
│   │   ├── useTimerTick.ts           # Interval-based timer tick (250 ms)
│   │   ├── useEventTick.ts           # 1 s interval for event countdowns
│   │   ├── useAlarm.ts               # Web Audio API alarm playback
│   │   └── useNotification.ts        # Browser Notification API wrapper
│   ├── utils/
│   │   ├── constants.ts              # MAX_TIMERS, MAX_EVENTS, defaults
│   │   ├── timeCalculations.ts       # Duration math, ID generation
│   │   └── dateFormat.ts             # Event countdown formatting
│   ├── types/
│   │   └── index.ts                  # Timer, CountdownEvent, Settings, Lap, etc.
│   ├── theme.ts                      # MUI light/dark theme config
│   ├── App.tsx                       # Root component
│   └── main.tsx                      # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── package.json
└── README.md
```

---

## Architecture

### State Management

Four **Zustand** stores handle independent slices of state:

| Store | Persisted | Key |
|-------|-----------|-----|
| `timersStore` | Yes | `countdown-timers` |
| `eventsStore` | Yes | `countdown-events` |
| `settingsStore` | Yes | `countdown-settings` |
| `stopwatchStore` | No | — |

Timers use **absolute end-timestamps** (`Date.now() + remaining * 1000`) so they survive tab sleep, system clock drift, and page refreshes.

### Component Hierarchy

```
App
├── AppBar (title + settings icon)
├── Navigation (Timers | Events | Stopwatch)
├── TabPanel: Timers
│   ├── TimerPresets (quick-start chips)
│   ├── TimerList
│   │   └── TimerCard[] → ProgressRing, controls, edit/delete
│   └── FAB (add timer)
├── TabPanel: Events
│   ├── EventList
│   │   └── EventCard[] → CountdownDisplay, edit/delete
│   └── FAB (add event)
├── TabPanel: Stopwatch
│   └── Stopwatch → LapList
└── SettingsDialog
    ├── Theme toggle (Light / System / Dark)
    ├── Sound switch + volume slider
    └── Notifications toggle
```

### Browser APIs Used

- **localStorage** — persist timers, events, settings
- **Web Audio API** — synthesize alarm tones
- **Notification API** — background timer-complete alerts
- **setInterval** — timer tick (250 ms) and event tick (1 s)
- **CSS media queries** — system dark-mode detection

---

## Deployment

### Vercel (recommended)

Push to GitHub and connect the repo on [vercel.com](https://vercel.com). Vercel auto-deploys on every push to `main`.

- **Build command:** `npm run build`
- **Output directory:** `dist/`

### Manual

```bash
npm run build
# Upload the dist/ folder to any static host (Netlify, GitHub Pages, S3, Firebase Hosting, etc.)
```

No environment variables or server are required — this is a fully client-side application.

---

## Browser Support

| Browser | Minimum | Status |
|---------|---------|--------|
| Chrome / Edge | 90+ | Supported |
| Firefox | 88+ | Supported |
| Safari | 14+ | Supported |
| Chrome Android | Latest | Supported |
| Safari iOS | 14+ | Supported |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Last updated: February 2026*
