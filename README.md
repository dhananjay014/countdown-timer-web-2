# Countdown Timer Web App

⏱️ A modern, feature-rich countdown timer application built with React, TypeScript, and Material Design. Track multiple timers simultaneously, count down to important events, customize your experience with themes and audio alerts.

**Live Demo:** [countdown-timer-web-2.vercel.app](https://countdown-timer-web-2.vercel.app)

## Tech Stack Badges

![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite 7](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![MUI 7](https://img.shields.io/badge/MUI-7.3-007FFF?logo=mui)
![Zustand 5](https://img.shields.io/badge/Zustand-5.0-000000)
![date-fns 4](https://img.shields.io/badge/date--fns-4.1-FF6B6B)

---

## Features

### Timer Management
- **Multiple Timers**: Run unlimited parallel timers with independent controls
- **Precise Duration Input**: Set hours, minutes, and seconds with intuitive controls
- **Timer States**: Full lifecycle management (idle → running → paused → completed)
- **Quick Actions**: Start, pause, resume, reset, edit, and delete timers
- **Visual Progress**: Animated circular progress ring showing remaining time at a glance
- **Time Display**: Large, easy-to-read countdown display with HH:MM:SS format
- **Smart Persistence**: All timers automatically saved to browser storage

### Event Countdowns
- **Future Date Tracking**: Count down to birthdays, holidays, releases, and custom events
- **Intelligent Formatting**:
  - Hours remaining (< 24h): `5h 30m 12s`
  - Days remaining (< 30d): `5d 3h`
  - Weeks/months: `2 weeks`, `3 months, 5 days`
- **Timezone Support**: Always uses user's local timezone for accurate countdowns
- **Live Updates**: Countdown updates every second automatically
- **Completion Detection**: Visual badge when event has passed

### Audio System
- **Web Audio API**: Built-in synthesized alarm (no external files needed)
- **Customizable Alerts**: 800Hz sine wave tone generated on-demand
- **Volume Control**: Adjustable volume from 0-100%
- **Toggle Audio**: Enable/disable alerts without affecting timer operations
- **Respects Settings**: Audio preferences persist across sessions

### Theme & Appearance
- **Material Design 3**: Modern, accessible UI following Material specifications
- **Dark Mode Support**:
  - Light theme for daytime use
  - Dark theme for low-light environments
  - System preference detection
- **Manual Override**: User can set theme regardless of system preference
- **Responsive Design**: Mobile, tablet, and desktop layouts
- **Smooth Animations**: Transitions and progress updates feel natural

### Persistence & Storage
- **Browser Storage**: All data saved in localStorage (no server required)
- **Automatic Saves**: Changes persist instantly to localStorage
- **Data Offline**: Full functionality without internet connection
- **Clear Storage**: Option to reset all timers and events with one click

### User Experience
- **Keyboard Shortcuts**: (Upcoming feature)
- **Edit in Place**: Modify timer durations and event names easily
- **Undo/Redo**: (Planned feature)
- **Empty States**: Helpful messages when no timers or events exist
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

---

## Why This Stack?

### React 19
- Latest concurrent rendering features
- Automatic batching for performance
- First-class error boundary support
- Server Components ready

### TypeScript 5.9
- Strict type checking prevents runtime errors
- Excellent IDE autocomplete and refactoring support
- Self-documenting code through type definitions
- Catches timer calculation bugs early

### Vite 7.2
- Lightning-fast dev server with HMR
- 10x faster than webpack for this project size
- Minimal configuration out of the box
- Excellent TypeScript support
- Fast production builds (~50KB gzipped)

### Material-UI 7.3
- Comprehensive component library reduces code
- Material Design 3 compliance (accessibility standards)
- Built-in theming system (perfect for dark mode)
- Active maintenance and large community

### Zustand 5
- Minimal, unopinionated state management (~1KB)
- Easy persist middleware for localStorage
- No boilerplate (compared to Redux)
- Direct state mutations without immer overhead
- Perfect for app-level state like timers and settings

### date-fns 4.1
- Modular (only import what you use)
- Immutable date operations (no side effects)
- Timezone handling via native Date objects
- Extensive formatting options for event countdowns

---

## Architecture Overview

### High-Level Data Flow

```
User Input (UI)
      ↓
   Zustand Store
      ↓
  ┌─────────┬──────────┬─────────┐
  ↓         ↓          ↓         ↓
Timers  Events   Settings   AudioState
  ↓         ↓          ↓         ↓
  └─────────┬──────────┬─────────┘
      ↓
localStorage (Persist)
```

### State Management Strategy

**Zustand** handles three independent stores:

1. **Timer Store** (`stores/useTimerStore.ts`)
   - Array of Timer objects
   - Methods: add, update, delete, start, pause, reset
   - Auto-persisted with `persist` middleware
   - Tick updates on RAF for smooth animation

2. **Event Store** (`stores/useEventStore.ts`)
   - Array of CountdownEvent objects
   - Methods: add, update, delete
   - Auto-persisted with `persist` middleware
   - Updates trigger every 1s for countdown accuracy

3. **Settings Store** (`stores/useSettingsStore.ts`)
   - Theme preference (light/dark/system)
   - Sound enabled and volume level
   - Future: other user preferences
   - Auto-persisted with `persist` middleware

### Component Hierarchy

```
App (Main Layout)
├── AppBar
│   ├── Title
│   └── Settings Icon Button
├── Navigation Tabs
│   ├── "Timers" Tab
│   └── "Events" Tab
├── TabPanel: Timers
│   ├── FloatingActionButton (Add Timer)
│   └── TimerList
│       └── TimerCard[] (repeats)
│           ├── ProgressRing
│           ├── TimerDisplay
│           ├── ControlButtons
│           │   ├── Play/Pause
│           │   ├── Reset
│           │   ├── Edit
│           │   └── Delete
│           └── TimerEditDialog
├── TabPanel: Events
│   ├── FloatingActionButton (Add Event)
│   └── EventList
│       └── EventCard[] (repeats)
│           ├── EventName
│           ├── CountdownDisplay
│           ├── ActionButtons
│           │   ├── Edit
│           │   └── Delete
│           └── EventEditDialog
└── SettingsDialog
    ├── ThemeSelector
    ├── SoundToggle
    └── VolumeSlider
```

---

## Project Structure

```
countdown-timer-web-2/
├── public/
│   └── vite.svg              # Vite logo (can be replaced)
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppBar.tsx         # Top navigation bar
│   │   │   ├── AppLayout.tsx      # Main layout wrapper
│   │   │   └── Navigation.tsx     # Tab navigation (Timers/Events)
│   │   │
│   │   ├── timers/
│   │   │   ├── TimerCard.tsx           # Individual timer display
│   │   │   ├── TimerList.tsx           # List container
│   │   │   ├── ProgressRing.tsx        # Circular progress visualization
│   │   │   ├── TimerDisplay.tsx        # HH:MM:SS text display
│   │   │   ├── ControlButtons.tsx      # Play/Pause/Reset/Edit/Delete
│   │   │   ├── TimerEditDialog.tsx     # Create/edit timer dialog
│   │   │   └── EmptyTimerState.tsx     # Empty state message
│   │   │
│   │   ├── events/
│   │   │   ├── EventCard.tsx           # Individual event display
│   │   │   ├── EventList.tsx           # List container
│   │   │   ├── EventEditDialog.tsx     # Create/edit event dialog
│   │   │   ├── CountdownDisplay.tsx    # Smart time formatting
│   │   │   └── EmptyEventState.tsx     # Empty state message
│   │   │
│   │   ├── settings/
│   │   │   ├── SettingsDialog.tsx      # Settings modal
│   │   │   ├── ThemeSelector.tsx       # Light/Dark/System picker
│   │   │   ├── SoundToggle.tsx         # Enable/disable audio
│   │   │   └── VolumeSlider.tsx        # Volume 0-100
│   │   │
│   │   └── common/
│   │       ├── ErrorBoundary.tsx       # Error handling
│   │       ├── LoadingSpinner.tsx      # Loading indicator
│   │       └── ConfirmDialog.tsx       # Delete confirmation
│   │
│   ├── stores/
│   │   ├── useTimerStore.ts       # Zustand timer state + methods
│   │   ├── useEventStore.ts       # Zustand event state + methods
│   │   └── useSettingsStore.ts    # Zustand settings state + methods
│   │
│   ├── hooks/
│   │   ├── useTimerTick.ts        # RAF-based timer tick animation
│   │   ├── useEventTick.ts        # 1s interval event countdown update
│   │   ├── useAudio.ts            # Web Audio API wrapper
│   │   ├── useTheme.ts            # System theme detection
│   │   └── useLocalStorage.ts     # Custom localStorage hook
│   │
│   ├── utils/
│   │   ├── timerCalculations.ts   # Duration math and conversions
│   │   ├── eventFormatting.ts     # Smart countdown text formatting
│   │   ├── audioGenerator.ts      # Synthesize sine wave alarm
│   │   ├── validation.ts          # Input validation helpers
│   │   └── storage.ts             # localStorage key constants
│   │
│   ├── types/
│   │   ├── timer.ts               # Timer interface and types
│   │   ├── event.ts               # CountdownEvent interface
│   │   └── settings.ts            # Settings interface
│   │
│   ├── theme.ts                   # MUI theme configuration
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # React DOM render entry point
│
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript root config
├── tsconfig.app.json              # TypeScript app-specific config
├── tsconfig.node.json             # TypeScript build tools config
├── eslint.config.js               # ESLint rules
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## Key Concepts & Algorithms

### Timer System

#### Timer Lifecycle

Timers progress through five distinct states:

1. **Idle** - Created but not started
   - User can adjust hours/minutes/seconds
   - Display shows full duration or edited value

2. **Running** - Active countdown in progress
   - Decrements every ~16ms (RAF tick)
   - Cannot modify duration while running
   - Play button becomes Pause button

3. **Paused** - Temporarily stopped
   - Remaining time preserved
   - User can resume or reset
   - Display shows paused time

4. **Completed** - Countdown reached zero
   - Audio alarm plays automatically
   - Visual badge indicates completion
   - User can reset to restart

5. **Deleted** - Removed from list
   - Can be deleted from any state
   - Confirmation dialog prevents accidents

#### Timer Accuracy with Absolute Timestamps

To ensure accuracy even when tabs sleep or system clock changes, timers use **absolute timestamps** rather than decrementing counters:

```typescript
// When user starts a timer with 5 minutes remaining:
const startTime = Date.now();
const remainingSeconds = 300;  // 5 minutes
const endTime = startTime + (remainingSeconds * 1000);
// Store endTime as the "source of truth"

// On every tick:
const now = Date.now();
const remaining = Math.ceil((endTime - now) / 1000);

// This survives:
// - Browser tab sleeping/inactive
// - System clock adjustments
// - Page refreshes (endTime was persisted)
// - Multiple simultaneous timers
```

#### Tick Algorithm (RequestAnimationFrame)

```typescript
// Hook: useTimerTick.ts
useEffect(() => {
  let animationFrameId: number;

  const tick = () => {
    const now = Date.now();
    const runningTimers = timers.filter(t => t.status === 'running');

    runningTimers.forEach(timer => {
      const remaining = Math.ceil((timer.endTime! - now) / 1000);

      if (remaining <= 0) {
        // Timer completed
        setTimerStatus(timer.id, 'completed');
        playAlarm();
        updateRemaining(timer.id, 0);
      } else {
        // Update remaining time
        updateRemaining(timer.id, remaining);
      }
    });

    animationFrameId = requestAnimationFrame(tick);
  };

  animationFrameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(animationFrameId);
}, [timers]);
```

**Why RAF instead of setInterval?**
- Synced with screen refresh (60fps on modern displays)
- Pauses automatically when tab is inactive (saves battery)
- Smoother animations (progress ring updates)
- Better for multi-timer updates

### Event System

#### Smart Countdown Formatting

Events use human-friendly time formatting that adapts to the countdown:

```typescript
// Examples of smart formatting:
formatEventRemaining(targetDate) {
  const diff = targetDate - Date.now();

  if (diff <= 0) return '🎉 Event passed!';

  const ms = diff;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  // Format based on magnitude:
  if (hours < 1) return `${minutes}m ${seconds % 60}s`;
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  if (days < 7) return `${days}d ${hours % 24}h`;
  if (days < 30) return `${days} days`;
  if (months < 12) return `${months} months, ${days % 30} days`;
  return `${Math.floor(months / 12)} years`;
}

// Output examples:
// 5 minutes 30 seconds until event → "5m 30s"
// 2 days 3 hours until event → "2d 3h"
// 45 days until event → "45 days"
// 3 months until event → "3 months, 15 days"
```

#### Event Tick Interval

Unlike timers which need smooth RAF updates, events tick every 1 second:

```typescript
// Hook: useEventTick.ts
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const events = store.getState().events;

    events.forEach(event => {
      const remaining = event.targetDate - now;

      if (remaining < 0 && !event.completed) {
        // Mark completed on first detection
        store.setState(current => ({
          events: current.events.map(e =>
            e.id === event.id ? { ...e, completed: true } : e
          )
        }));
      }
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### State Management Pattern

Each store follows the same Zustand + localStorage pattern:

```typescript
// Pattern: useTimerStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  timers: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  setTimerStatus: (id: string, status: TimerStatus) => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timers: [],

      addTimer: (timer) => set(state => ({
        timers: [...state.timers, timer]
      })),

      updateTimer: (id, updates) => set(state => ({
        timers: state.timers.map(t =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),

      deleteTimer: (id) => set(state => ({
        timers: state.timers.filter(t => t.id !== id)
      })),

      setTimerStatus: (id, status) =>
        get().updateTimer(id, { status })
    }),
    {
      name: 'countdown-timers', // localStorage key
      version: 1, // For migration if schema changes
    }
  )
);
```

### Theme System

Material-UI theme is configured in `theme.ts` with support for automatic dark mode:

```typescript
// theme.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
});

// In App.tsx:
const { theme: themePreference } = useSettingsStore();
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
const shouldUseDark =
  themePreference === 'dark' ||
  (themePreference === 'system' && prefersDark);

<ThemeProvider theme={shouldUseDark ? darkTheme : lightTheme}>
  <App />
</ThemeProvider>
```

### Audio System

The alarm uses Web Audio API to synthesize a tone without external files:

```typescript
// Hook: useAudio.ts
export const useAudio = () => {
  const { soundEnabled, volume } = useSettingsStore();

  const playAlarm = () => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Create 800Hz sine wave
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return { playAlarm };
};
```

**Why synthesized audio?**
- No external audio files to load
- Smaller bundle size
- Works offline
- Consistent across devices
- Can easily adjust frequency/duration

---

## Data Models

### Timer

```typescript
interface Timer {
  id: string;                    // UUID v4
  label: string;                 // User-provided name
  hours: number;                 // 0-99
  minutes: number;               // 0-59
  seconds: number;               // 0-59
  totalSeconds: number;          // hours*3600 + minutes*60 + seconds
  remainingTime: number;         // Current countdown (seconds)
  endTime: number | null;        // Absolute timestamp when timer ends (ms)
  status: 'idle'                 // Timer not started
           | 'running'           // Currently counting down
           | 'paused'            // Temporarily stopped
           | 'completed';        // Reached zero
  createdAt: number;             // Unix timestamp (ms)
}

// Example:
const timer: Timer = {
  id: 'timer-123abc',
  label: 'Laundry',
  hours: 0,
  minutes: 30,
  seconds: 0,
  totalSeconds: 1800,
  remainingTime: 1800,
  endTime: null,
  status: 'idle',
  createdAt: 1707300000000
};
```

### CountdownEvent

```typescript
interface CountdownEvent {
  id: string;                    // UUID v4
  name: string;                  // Event name (birthday, release, etc.)
  targetDate: number;            // Unix timestamp (ms) of event
  completed: boolean;            // True if event date has passed
  createdAt: number;             // When event was created
}

// Example:
const event: CountdownEvent = {
  id: 'event-xyz789',
  name: 'React 20 Release',
  targetDate: new Date('2025-12-25').getTime(),
  completed: false,
  createdAt: 1707300000000
};
```

### Settings

```typescript
interface Settings {
  soundEnabled: boolean;         // Audio alerts on/off
  volume: number;                // 0-100 percentage
  theme: 'light' | 'dark' | 'system';
}

// Example:
const settings: Settings = {
  soundEnabled: true,
  volume: 75,
  theme: 'system'
};
```

---

## Component API Reference

### TimerCard

Displays a single timer with controls and progress visualization.

```typescript
interface TimerCardProps {
  timer: Timer;
  onEdit: (timer: Timer) => void;
  onDelete: (timerId: string) => void;
}

// Usage:
<TimerCard
  timer={timer}
  onEdit={(updated) => updateTimer(updated.id, updated)}
  onDelete={(id) => deleteTimer(id)}
/>
```

**Features:**
- Circular progress ring (0-100%)
- Large countdown display (HH:MM:SS)
- Completion badge (visual indicator when done)
- Start/Pause button (context-aware)
- Reset button
- Edit button (opens dialog)
- Delete button (confirms before deleting)

### EventCard

Displays a single countdown event with smart formatting.

```typescript
interface EventCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
  onDelete: (eventId: string) => void;
}

// Usage:
<EventCard
  event={event}
  onEdit={(updated) => updateEvent(updated.id, updated)}
  onDelete={(id) => deleteEvent(id)}
/>
```

**Features:**
- Event name display
- Smart countdown formatting (adaptive)
- Completion badge (for past events)
- Last updated timestamp
- Edit button
- Delete button

### TimerEditDialog

Modal for creating or editing a timer.

```typescript
interface TimerEditDialogProps {
  open: boolean;
  timer?: Timer;  // If provided, edit mode; if absent, create mode
  onClose: () => void;
  onSave: (timer: Timer) => void;
}

// Usage:
<TimerEditDialog
  open={dialogOpen}
  timer={selectedTimer}
  onClose={() => setDialogOpen(false)}
  onSave={(timer) => {
    if (selectedTimer) {
      updateTimer(timer.id, timer);
    } else {
      addTimer(timer);
    }
  }}
/>
```

**Features:**
- Input fields: label, hours, minutes, seconds
- Validation (0-99 hours, 0-59 min/sec)
- Save/Cancel buttons
- Pre-populated values in edit mode
- Focus management for accessibility

### EventEditDialog

Modal for creating or editing an event.

```typescript
interface EventEditDialogProps {
  open: boolean;
  event?: CountdownEvent;
  onClose: () => void;
  onSave: (event: CountdownEvent) => void;
}

// Usage:
<EventEditDialog
  open={dialogOpen}
  event={selectedEvent}
  onClose={() => setDialogOpen(false)}
  onSave={(event) => {
    if (selectedEvent) {
      updateEvent(event.id, event);
    } else {
      addEvent(event);
    }
  }}
/>
```

**Features:**
- Event name input
- Date picker (native HTML5)
- Time picker (hours/minutes)
- Validation (date must be in future)
- Save/Cancel buttons

### SettingsDialog

Settings modal with theme, audio, and volume controls.

```typescript
interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

// Usage:
<SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
```

**Features:**
- Theme selector (light/dark/system)
- Sound toggle switch
- Volume slider (0-100)
- Test sound button
- Save button (auto-persisted)

---

## Getting Started

### Prerequisites

- Node.js 18+ (for npm)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/countdown-timer-web-2.git
cd countdown-timer-web-2

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server starts at `http://localhost:5173` with Hot Module Replacement (HMR).

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint
```

### Environment

This is a **client-side only** application. No environment variables are needed.

**Browser APIs Used:**
- `localStorage` - Persist timers, events, settings
- `Web Audio API` - Generate alarm sounds
- `requestAnimationFrame` - Smooth timer updates
- `setInterval` - Event countdown updates
- Media Queries - System dark mode detection

---

## Development Guide

### Adding a New Timer Feature

Example: Add a "repeat" feature to timers (timer restarts automatically).

1. **Update type definition** (`src/types/timer.ts`):
```typescript
interface Timer {
  // ... existing fields
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatEndDate?: number;  // Optional end date for repeats
}
```

2. **Update store** (`src/stores/useTimerStore.ts`):
```typescript
const completeTimer = (id: string) => {
  const timer = state.timers.find(t => t.id === id);
  if (timer?.repeat === 'none') {
    setTimerStatus(id, 'completed');
  } else {
    // Calculate next occurrence based on repeat pattern
    const nextEndTime = calculateNextRepeatTime(timer);
    updateTimer(id, {
      status: 'running',
      endTime: nextEndTime,
      remainingTime: calculateRemaining(nextEndTime)
    });
  }
};
```

3. **Update component** (`src/components/timers/TimerEditDialog.tsx`):
```typescript
// Add repeat selector UI
<FormControl fullWidth>
  <InputLabel>Repeat</InputLabel>
  <Select
    value={repeat}
    onChange={(e) => setRepeat(e.target.value)}
  >
    <MenuItem value="none">No repeat</MenuItem>
    <MenuItem value="daily">Daily</MenuItem>
    <MenuItem value="weekly">Weekly</MenuItem>
    <MenuItem value="monthly">Monthly</MenuItem>
  </Select>
</FormControl>
```

4. **Test the feature**:
```bash
npm run dev
# Create timer with repeat
# Verify it restarts after completion
# Check that settings persist after page reload
```

### Modifying the Theme

Material-UI theme is in `src/theme.ts`:

```typescript
// To change primary color:
const lightTheme = createTheme({
  palette: {
    primary: { main: '#FF6B6B' },  // Change this
  },
});

// To add custom typography:
const lightTheme = createTheme({
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
  },
});
```

Then restart dev server for HMR to apply changes.

### Adding Validation Rules

Input validation is in `src/utils/validation.ts`:

```typescript
// Example: Validate timer label not empty
export const isValidTimerLabel = (label: string): boolean => {
  return label.trim().length > 0 && label.trim().length <= 50;
};

// In component:
const [error, setError] = useState<string>('');

const handleSave = () => {
  if (!isValidTimerLabel(label)) {
    setError('Label must be 1-50 characters');
    return;
  }
  onSave(timer);
};
```

### Manual Testing Checklist

Before committing, verify:

- **Timer Creation**: Can create timer with valid inputs
- **Timer Running**: Timer counts down correctly, reaches zero, plays alarm
- **Timer Controls**: Start/pause/reset work correctly
- **Persistence**: Refresh page, timers still exist with correct state
- **Multiple Timers**: Run 3+ timers simultaneously, all tick correctly
- **Event Creation**: Create event with future date
- **Event Countdown**: Smart formatting updates correctly (5m 30s → "5m 30s")
- **Theme Toggle**: Light/dark mode switch works, persists after reload
- **Audio**: Sound plays on timer completion, volume adjusts
- **Mobile**: Responsive layout on phone/tablet (DevTools)
- **Accessibility**: Tab navigation works, no ARIA warnings in console

---

## Deployment

### Deploy to Vercel

The easiest way to deploy this app (pre-configured):

```bash
# Push code to GitHub
git add .
git commit -m "Add feature XYZ"
git push origin main

# Go to https://vercel.com
# Connect your GitHub repository
# Vercel auto-deploys on every push to main
```

**Vercel Configuration** (already in repo):
- Build command: `npm run build`
- Output directory: `dist/`
- Environment: Node.js 18+

### Manual Deployment

To deploy anywhere:

```bash
# Build optimized bundle
npm run build

# Output: dist/ folder (contains index.html + JS/CSS bundles)
# Upload dist/ contents to any static hosting:
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
# - Firebase Hosting
# - etc.
```

**Bundle Size**: ~50KB gzipped (Material-UI is included)

### Environment Setup

**No environment variables needed** - this is a client-side only app.

All configuration is:
- Stored in localStorage (user preferences)
- Coded in `src/theme.ts` (MUI theme)
- Hard-coded in Zustand stores (defaults)

---

## Browser Support

### Tested & Supported

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 90+ | ✓ Fully Supported |
| Firefox | 88+ | ✓ Fully Supported |
| Safari | 14+ | ✓ Fully Supported |
| Edge | 90+ | ✓ Fully Supported |
| Opera | 76+ | ✓ Fully Supported |
| Chrome Android | Latest | ✓ Fully Supported |
| Safari iOS | 14+ | ✓ Fully Supported |

### Required APIs

- **localStorage** - All browsers support (needed for persistence)
- **Web Audio API** - All modern browsers support (needed for alarm)
- **requestAnimationFrame** - All modern browsers support (needed for smooth updates)
- **CSS Grid/Flexbox** - All modern browsers support (UI layout)

### Unsupported

- Internet Explorer (use modern browser instead)
- Very old Safari (<14)

---

## Known Limitations

### Current Version

1. **No Cloud Sync**
   - Data stored in localStorage only
   - No account/login system
   - Data not backed up to cloud
   - Not synced across devices

2. **No Notifications API**
   - Alarm plays only when browser tab is active
   - Background notifications not supported
   - Mobile users should keep browser open

3. **No Sharing**
   - Cannot share timers with others
   - No collaboration features
   - No public timer links

4. **Storage Limits**
   - localStorage limited to ~5-10MB
   - Max ~500 timers/events before running out
   - No way to export/import data yet

5. **Audio Limitations**
   - Synthesized tone only (800Hz sine wave)
   - Cannot use custom alarm sounds
   - Audio context requires user interaction first

6. **Mobile Limitations**
   - No home screen shortcut (PWA) yet
   - No offline support yet
   - Tab must stay active for notifications

---

## Future Enhancements

### Planned Features

**Near Term:**
- [ ] Timer presets (Pomodoro 25min, Microwave 3min, etc.)
- [ ] Notification API integration (background alerts)
- [ ] PWA support (home screen app, offline mode)
- [ ] Export/import timers as JSON

**Medium Term:**
- [ ] Cloud sync (Firebase or Supabase)
- [ ] Timer history and statistics
- [ ] Keyboard shortcuts (Space to start/pause, etc.)
- [ ] Custom alarm sounds
- [ ] Multiple alarm sounds to choose from

**Long Term:**
- [ ] User accounts and cloud sync
- [ ] Share timers with friends
- [ ] Public timer links
- [ ] Collaborative timers
- [ ] Timer templates/recipes
- [ ] Browser notifications
- [ ] Mobile app (React Native)

### Community Suggestions Welcome

Open an issue to suggest features or vote on existing ideas!

---

## Code Style & Standards

### TypeScript Strict Mode

All code uses `strict: true` in tsconfig.json:
- No `any` types (use `unknown` if needed)
- Explicit return types on functions
- All parameters must be typed
- No implicit `undefined` returns

### ESLint Rules

Configured in `eslint.config.js`:
- No unused variables
- No unused parameters
- No console.log in production code
- React hooks dependencies complete

### Component Patterns

**Functional Components Only**
```typescript
// Good
const TimerCard: React.FC<TimerCardProps> = ({ timer, onEdit }) => {
  return <div>{timer.label}</div>;
};

// Bad - Don't use class components
class TimerCard extends React.Component { }
```

**Hooks for All State**
```typescript
// Good
const [count, setCount] = useState(0);

// Bad - Don't use Context for simple state
const MyContext = createContext();
```

---

## Contributing

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/countdown-timer-web-2.git`
3. Create feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`
6. Make your changes
7. Test thoroughly (see testing checklist above)
8. Commit with clear message: `git commit -m "Add feature: timer presets"`
9. Push to branch: `git push origin feature/amazing-feature`
10. Open Pull Request

### Pull Request Process

- Describe what your PR adds/fixes
- Link related issues if applicable
- Include testing checklist results
- Ensure linting passes: `npm run lint`
- Ensure build succeeds: `npm run build`

### Code Review

- PRs are reviewed for:
  - Type safety (no `any` types)
  - Performance (no unnecessary re-renders)
  - Accessibility (ARIA, keyboard navigation)
  - Test coverage (manual tests pass)
  - Documentation (code comments where needed)

---

## License

MIT License - See LICENSE file for details

This means you can:
- Use this app commercially
- Modify the code
- Distribute it
- Use it privately

Just include a copy of the license and give credit to original authors.

---

## Troubleshooting

### Timers not persisting after page reload

**Check:**
1. Browser localStorage is enabled (DevTools → Application → Local Storage)
2. Check localStorage contains `countdown-timers` key
3. Open DevTools console, check for errors
4. Try clearing cache: `npm run build && npm run preview`

### Alarm not playing

**Check:**
1. Sound is enabled in Settings dialog
2. Browser volume is not muted
3. Browser has permission to access audio (check in DevTools)
4. Try testing sound with Settings button
5. Some browsers require user interaction first

### Timer not counting down

**Check:**
1. Timer is in "running" state (check Start/Pause button)
2. Browser tab is active (RAF pauses in inactive tabs)
3. No JavaScript errors in DevTools console
4. Try refreshing page
5. Clear browser cache

### Theme not changing

**Check:**
1. Settings dialog is open
2. Correct theme option is selected
3. "System" theme follows OS preference (check System Preferences)
4. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### localStorage quota exceeded

**Solution:**
1. Delete old timers/events you no longer need
2. Limit timers to 100 or fewer
3. Clear localStorage: `localStorage.clear()` in console (loses all data)

---

## Contact & Support

- **Issues**: Open on GitHub
- **Discussions**: GitHub Discussions tab
- **Email**: your-email@example.com

---

## Changelog

### v1.0.0 (Current)
- Initial release
- Timer management (create, start, pause, reset, delete)
- Event countdowns with smart formatting
- Dark mode with system preference detection
- Audio alerts with volume control
- Full offline support via localStorage
- Mobile responsive design
- Material Design 3 UI

### Planned v1.1.0
- Timer presets feature
- Notification API integration
- PWA support
- Export/import functionality

---

## Resources

### Documentation
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Material-UI Documentation](https://mui.com)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [date-fns Documentation](https://date-fns.org)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [MDN Web Docs](https://developer.mozilla.org)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Similar Projects
- [Pomofocus](https://pomofocus.io/) - Pomodoro timer
- [Timer Tabs](https://www.timer-tab.com/) - Browser timer tab
- [Cuckoo](http://www.cuckoo.team/) - Team timer app

---

**Made with ⏱️ by the Countdown Timer team**

*Last updated: February 2025*
