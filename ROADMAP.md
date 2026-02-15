# Countdown Timer Web App - Product Roadmap

**Document Version:** 1.0
**Last Updated:** 2026-02-08
**Live Product:** [countdown-timer-web-2.vercel.app](https://countdown-timer-web-2.vercel.app)

---

## 1. Vision & Mission

### Product Vision

Become the go-to web-based timer application that helps individuals manage their time with precision, flexibility, and delight -- from a quick kitchen timer to sophisticated productivity workflows.

### Mission Statement

Deliver a fast, reliable, beautiful countdown timer that works everywhere -- on any device, any browser, online or offline -- with zero friction to start and powerful features for power users who stay.

### North Star Metric

**Weekly Active Timer Starts (WATS):** The total number of timers started per week across all users. This metric captures both user acquisition (more users) and engagement depth (more timers per user) in a single number.

Supporting metrics:
- Return rate (7-day): % of users who come back within 7 days
- Session duration: Average time spent in the app per visit
- Timers per session: Average number of timers started per session

### Target Personas (Prioritized)

| Priority | Persona | Description | Key Need |
|----------|---------|-------------|----------|
| **P0** | **Casual Timer User** | Needs a quick timer for cooking, laundry, breaks. Opens browser, sets timer, done. | Speed, simplicity, reliability |
| **P1** | **Productivity Enthusiast** | Uses Pomodoro or time-boxing techniques. Wants structured intervals and session tracking. | Workflows, history, discipline tools |
| **P2** | **Event Tracker** | Counts down to birthdays, product launches, holidays. Wants visual reminders. | Date countdowns, sharing, notifications |
| **P3** | **Team/Classroom User** | Shares timers with groups for meetings, presentations, classroom activities. | Sharing, large display, collaboration |

---

## 2. Current State (v1.0)

### What Exists Today

The app is a fully functional client-side countdown timer built with React 19, TypeScript 5.9, Vite 7, MUI 7, and Zustand 5. It is deployed on Vercel.

**Core capabilities:**
- Create, start, pause, resume, reset, edit, and delete timers (max 20)
- Create, edit, and delete event countdowns (max 50)
- Circular progress ring visualization with smooth 250ms tick updates
- Absolute timestamp-based timer accuracy (survives tab sleep, page refresh)
- Synthesized 800Hz alarm via Web Audio API with volume control
- Light/dark/system theme with Material Design 3 styling
- Full localStorage persistence across sessions (3 Zustand stores)
- Responsive grid layout (1-4 columns depending on viewport)
- Alarm overlay dialog with dismiss action
- Empty state messaging for both tabs

**Technical stack:**
- 24 source files, ~1,200 lines of application code
- 5 components directories (timers, events, settings, layout, common)
- 3 Zustand stores with persist middleware (timers, events, settings)
- 2 custom hooks (useAlarm, useTimerTick)
- 2 utility modules (timeCalculations, constants)
- 1 type definition file
- ~50KB gzipped production bundle
- No test files, no CI/CD pipeline, no service worker, no PWA manifest

### Key Metrics Baseline

| Metric | Current Value | Notes |
|--------|---------------|-------|
| Bundle size (gzipped) | ~50KB | Acceptable for SPA |
| Max timers | 20 | Hard-coded in constants.ts |
| Max events | 50 | Hard-coded in constants.ts |
| Tick interval | 250ms | setInterval-based, not RAF |
| Source files | 24 | Clean, well-structured |
| Test coverage | 0% | No test files exist |
| Lighthouse Performance | Not measured | Needs baseline audit |
| Accessibility score | Not measured | Basic ARIA exists on settings button only |
| PWA score | 0 | No service worker, no manifest |

### Known Limitations

1. **No background timer notifications** -- alarm only plays when tab is active and focused
2. **No PWA support** -- cannot install to home screen, no offline caching strategy
3. **No keyboard shortcuts** -- all interactions require mouse/touch
4. **Timer tick uses setInterval (250ms)** -- README describes RAF but implementation uses setInterval; adequate but not optimal
5. **No undo for delete** -- delete is immediate and permanent (no confirmation dialog despite README mentioning one)
6. **No timer presets** -- every timer must be configured manually from scratch
7. **Single alarm sound** -- 800Hz sine wave only, no variety
8. **Tab title does not update** -- no visual indicator of running timer in browser tab
9. **No export/import** -- data trapped in single browser's localStorage
10. **No test suite** -- zero automated tests; all verification is manual
11. **AlarmOverlay resets timer on dismiss** -- user cannot dismiss alarm and keep the completed state
12. **No sorting/filtering for timers** -- grid order is creation order only
13. **Events cannot be created for past dates** -- validation blocks it, preventing historical tracking

---

## 3. Product Principles

### Design Principles

1. **Instant Utility** -- A user should be able to start a timer within 3 seconds of opening the app. Every screen, dialog, and interaction should minimize friction.
2. **Glanceable** -- Timer state must be readable at arm's length. Large numbers, high contrast, clear progress visualization. The circular progress ring is a core differentiator.
3. **Quiet Until Needed** -- The app should be calm and unobtrusive while timers run. The alarm should be unmissable. Nothing in between should demand attention.
4. **Progressive Complexity** -- Basic use requires zero learning. Advanced features (presets, Pomodoro, sharing) reveal themselves naturally, never clutter the default experience.

### Technical Principles

1. **Client-First** -- The app must work fully offline with zero server dependency through v1.5. Server features (sync, sharing) are additive, never required.
2. **Accuracy Over Precision** -- Use absolute timestamps (Date.now() + endTime) for timer accuracy. Never rely on interval counting.
3. **Type Safety Everywhere** -- Strict TypeScript with no `any` types. Every data model, store method, and component prop is fully typed.
4. **Small Bundle** -- Every dependency must justify its weight. Target <100KB gzipped through v1.5. MUI tree-shaking is essential.
5. **Persist Everything That Matters** -- User data (timers, events, settings) survives refresh, tab close, and browser restart via localStorage/IndexedDB.

### User Experience Principles

1. **No Account Required** -- Core functionality never requires sign-up. Cloud sync is opt-in.
2. **Forgiveness** -- Destructive actions (delete) have undo or confirmation. Accidental data loss is unacceptable.
3. **Works Like a Native App** -- Installable via PWA, fast transitions, no loading spinners for local operations.
4. **Accessible by Default** -- WCAG AA compliance. Full keyboard navigation. Screen reader support. Reduced motion respect.

---

## 4. Feature Roadmap

---

### v1.1 - Polish & Foundation (4-6 weeks)

**Theme:** "Make the core experience exceptional"

**Release Goal:** Transform the working prototype into a production-quality application that users trust enough to rely on daily. Fix the background timer problem, add PWA installability, and establish the quality baseline (tests, accessibility, keyboard support).

---

#### Feature 1.1.1: Background Timer Reliability

**Priority:** CRITICAL
**Effort:** L (Large)
**Risk:** HIGH -- iOS Safari has aggressive tab throttling

**User Story:**
As a timer user, I want my timer alarm to fire even when I switch to another tab or lock my screen, so that I can trust the app to alert me without keeping it in the foreground.

**Success Criteria:**
- [ ] Timer alarm fires within 5 seconds of completion when tab is backgrounded on Chrome, Firefox, Safari, Edge
- [ ] Timer alarm fires within 30 seconds on iOS Safari (best effort; document limitation if impossible)
- [ ] Notification permission is requested on first timer start (not on page load)
- [ ] If notification permission is denied, alarm still plays when tab regains focus
- [ ] Tab title shows remaining time of the most recently started timer (e.g., "05:23 - Countdown Timer")

**Technical Approach:**
- Add Notification API integration: `Notification.requestPermission()` on first timer start
- When timer completes, fire `new Notification("Timer Complete", { body: label, requireInteraction: true })`
- Add `document.title` update in the tick function: show `MM:SS - Countdown Timer` for the first running timer
- Register a Service Worker that listens for `push` events as a future hook (but v1.1 uses foreground Notification API only)
- Add `visibilitychange` listener: when tab becomes visible, immediately tick all timers to catch up

**Dependencies:** Service Worker (Feature 1.1.2)
**Risks:** iOS Safari does not support Web Push or Notification API in PWA mode before iOS 16.4. Must document this and provide `visibilitychange` fallback.

---

#### Feature 1.1.2: PWA Support

**Priority:** HIGH
**Effort:** M (Medium)

**User Story:**
As a mobile user, I want to install the Countdown Timer to my home screen so that it feels like a native app and loads instantly.

**Success Criteria:**
- [ ] `manifest.json` present with name, icons (192px, 512px), theme color, background color, display: standalone
- [ ] Service worker registered and caches shell assets (HTML, CSS, JS, fonts)
- [ ] App is installable on Chrome Android, Chrome Desktop, Safari iOS (Add to Home Screen)
- [ ] Lighthouse PWA audit score >= 90
- [ ] Offline access works: app loads from cache when network is unavailable

**Technical Approach:**
- Create `/public/manifest.json` with app metadata and icons
- Use `vite-plugin-pwa` (Workbox-based) for automatic service worker generation
- Cache strategy: Shell (precache), API (network-first with cache fallback -- N/A for v1.1, but ready)
- Add `<link rel="manifest" href="/manifest.json">` to index.html
- Add apple-touch-icon and theme-color meta tags
- Create app icons at 192x192 and 512x512

**Dependencies:** None
**Risks:** Low. Well-established pattern with Vite tooling.

---

#### Feature 1.1.3: Keyboard Shortcuts

**Priority:** MEDIUM
**Effort:** S (Small)

**User Story:**
As a power user, I want to use keyboard shortcuts to control timers without reaching for my mouse, so that I can manage timers while working.

**Success Criteria:**
- [ ] `Space` toggles play/pause on the focused timer
- [ ] `N` opens the "New Timer" dialog
- [ ] `Escape` closes any open dialog
- [ ] `Delete` or `Backspace` on focused timer opens delete confirmation
- [ ] `R` resets the focused timer
- [ ] `1`/`2` switches between Timers/Events tabs
- [ ] Shortcut help (`?`) displays a keyboard shortcut overlay
- [ ] Shortcuts do not fire when a text input is focused

**Technical Approach:**
- Create `useKeyboardShortcuts` hook with `keydown` event listener on `document`
- Guard: skip when `event.target` is an input, textarea, or contenteditable
- Timer card focus: add `tabIndex={0}` to timer cards, track focused card ID in state
- Show shortcut help in a lightweight dialog triggered by `?`

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.1.4: Timer Presets

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a frequent timer user, I want quick-start presets (e.g., 5 min, 10 min, 15 min, 25 min, 30 min, 1 hour) so that I can create timers with a single tap instead of configuring hours/minutes/seconds each time.

**Success Criteria:**
- [ ] Preset chips displayed above the timer grid (or in the "New Timer" dialog)
- [ ] Tapping a preset creates and immediately starts a timer with that duration
- [ ] Default presets: 1m, 3m, 5m, 10m, 15m, 25m, 30m, 1h
- [ ] User can customize presets (add/remove/rename) in Settings
- [ ] Custom presets persist in localStorage

**Technical Approach:**
- Add `presets` array to Settings store: `{ label: string, seconds: number }[]`
- Render as MUI `Chip` components in a horizontal scrollable row
- Tapping a preset calls `addTimer(label, h, m, s)` then `startTimer(id)`
- Settings dialog gains a "Manage Presets" section with add/edit/delete

**Dependencies:** None
**Risks:** Low. UI layout needs care to not crowd the timer grid on mobile.

---

#### Feature 1.1.5: Notification Support

**Priority:** HIGH
**Effort:** S (Small)

*Note: This is the permission/UI layer. The actual firing logic is in Feature 1.1.1.*

**User Story:**
As a user, I want to control notification preferences in Settings so that I can enable or disable browser notifications for timer completion.

**Success Criteria:**
- [ ] Settings dialog shows "Notifications" toggle (default: off until permission granted)
- [ ] Toggling on triggers `Notification.requestPermission()`
- [ ] If permission denied, toggle shows "Blocked" state with instructions to unblock
- [ ] If permission granted, toggle is on and notifications fire on timer completion
- [ ] Notification setting persists in localStorage

**Technical Approach:**
- Add `notificationsEnabled: boolean` to Settings store
- Add `setNotificationsEnabled` method that checks/requests permission
- Add UI toggle in SettingsDialog with contextual status text

**Dependencies:** Feature 1.1.1 (Background Timer Reliability)
**Risks:** Low.

---

#### Feature 1.1.6: Basic Accessibility (WCAG AA)

**Priority:** HIGH
**Effort:** M (Medium)

**User Story:**
As a user who relies on assistive technology, I want the app to be fully navigable with a keyboard and screen reader so that I can use all timer features independently.

**Success Criteria:**
- [ ] All interactive elements are reachable via Tab key in logical order
- [ ] All buttons have descriptive `aria-label` attributes (e.g., "Start timer: Laundry", not just "Play")
- [ ] Timer progress is announced via `aria-live="polite"` region (updates every 10 seconds, not every tick)
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for large text) in both light and dark themes
- [ ] Focus indicators are clearly visible on all interactive elements
- [ ] Dialogs trap focus correctly (already handled by MUI Dialog)
- [ ] `prefers-reduced-motion` is respected: disable progress ring animation
- [ ] Lighthouse Accessibility score >= 90

**Technical Approach:**
- Audit all components for missing `aria-label`, `aria-describedby`, `role` attributes
- Add `aria-live` region for timer countdown announcements
- Review and adjust theme colors for contrast compliance using WebAIM contrast checker
- Add `:focus-visible` outline styles
- Add `@media (prefers-reduced-motion: reduce)` to disable CSS transitions
- Run axe-core automated audit and fix all reported issues

**Dependencies:** None
**Risks:** Medium. Contrast changes may require theme color adjustments that affect visual design.

---

#### Feature 1.1.7: Sound Variety

**Priority:** LOW
**Effort:** S (Small)

**User Story:**
As a user, I want to choose from multiple alarm sounds so that I can pick one that is noticeable but not annoying in my environment.

**Success Criteria:**
- [ ] At least 4 alarm sound options: Classic Beep (current 800Hz), Gentle Chime (lower frequency), Alert Tone (rising pitch), Digital Buzz (square wave)
- [ ] Sound selector in Settings dialog with preview/test button for each
- [ ] Selected sound persists across sessions
- [ ] All sounds are synthesized via Web Audio API (no external audio files)

**Technical Approach:**
- Create `alarmSounds` config array in constants.ts with frequency, waveform, pattern parameters
- Modify `useAlarm` hook to accept a sound profile
- Add `selectedAlarm: string` to Settings store
- Add radio button or chip selector in SettingsDialog

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.1.8: Undo Delete

**Priority:** MEDIUM
**Effort:** S (Small)

**User Story:**
As a user, I want to undo a timer or event deletion within a few seconds so that I do not permanently lose data by accident.

**Success Criteria:**
- [ ] Deleting a timer/event shows a Snackbar with "Timer deleted. UNDO" for 5 seconds
- [ ] Clicking UNDO restores the timer/event to its previous position and state
- [ ] If undo window expires, deletion is permanent
- [ ] Undo works for both timers and events
- [ ] Only the most recent deletion is undoable (not a full undo stack)

**Technical Approach:**
- On delete: move item to a `recentlyDeleted` state slot instead of removing immediately
- Show MUI `Snackbar` with `action={<Button onClick={undo}>UNDO</Button>}`
- On undo: move item back from `recentlyDeleted` to the main array
- On timeout (5s): permanently remove from `recentlyDeleted`
- Store `recentlyDeleted` in component state (not persisted -- if page refreshes, it is gone, which is acceptable)

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.1.9: Tab Title Updates

**Priority:** MEDIUM
**Effort:** S (Small)

*Note: Implementation is part of Feature 1.1.1 but listed separately for tracking.*

**User Story:**
As a user with multiple browser tabs, I want to see the remaining time in the browser tab title so that I can glance at it without switching to the timer tab.

**Success Criteria:**
- [ ] When one or more timers are running, tab title shows `MM:SS - Countdown Timer` for the timer with the least remaining time
- [ ] When no timers are running, tab title reverts to `Countdown Timer`
- [ ] When a timer completes, tab title flashes `TIME'S UP! - Countdown Timer` until dismissed
- [ ] Title updates at the same interval as the timer tick (250ms)

**Technical Approach:**
- Modify `useTimerTick` hook to also set `document.title` based on running timer state
- Select the timer with minimum `remainingTime` among running timers

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.1.10: Test Foundation

**Priority:** HIGH
**Effort:** M (Medium)

**User Story:**
As a developer, I want automated tests covering core timer logic so that I can make changes with confidence and prevent regressions.

**Success Criteria:**
- [ ] Testing framework installed and configured (Vitest + React Testing Library)
- [ ] Unit tests for `timeCalculations.ts` (formatTime, formatEventRemaining, generateId)
- [ ] Unit tests for timer store (addTimer, startTimer, pauseTimer, resetTimer, deleteTimer, tickTimers)
- [ ] Unit tests for event store (addEvent, updateEvent, deleteEvent)
- [ ] Unit tests for settings store (setTheme, setSoundEnabled, setVolume)
- [ ] Component test for TimerCard (renders, play/pause click handlers)
- [ ] Component test for TimerForm (validation, save behavior)
- [ ] Minimum 70% line coverage on stores and utils
- [ ] `npm test` script added to package.json
- [ ] Tests run in CI (GitHub Actions)

**Technical Approach:**
- Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- Configure in `vite.config.ts` or `vitest.config.ts`
- Add GitHub Actions workflow: lint + type-check + test on PR

**Dependencies:** None
**Risks:** Low.

---

#### v1.1 Release Summary

| Feature | Priority | Effort | Risk |
|---------|----------|--------|------|
| Background Timer Reliability | CRITICAL | L | HIGH |
| PWA Support | HIGH | M | LOW |
| Keyboard Shortcuts | MEDIUM | S | LOW |
| Timer Presets | MEDIUM | M | LOW |
| Notification Support | HIGH | S | LOW |
| Basic Accessibility (WCAG AA) | HIGH | M | MEDIUM |
| Sound Variety | LOW | S | LOW |
| Undo Delete | MEDIUM | S | LOW |
| Tab Title Updates | MEDIUM | S | LOW |
| Test Foundation | HIGH | M | LOW |

**Total effort estimate:** 4-6 weeks (1 developer)
**Critical path:** Background Timer Reliability --> Notification Support --> PWA Support

---

### v1.5 - Workflows (8-10 weeks)

**Theme:** "Support advanced time management workflows"

**Release Goal:** Transform the app from a simple timer into a productivity tool. Add Pomodoro mode, sequential/interval timers, session history, and data portability. This release targets the Productivity Enthusiast persona.

---

#### Feature 1.5.1: Pomodoro Mode

**Priority:** HIGH
**Effort:** L (Large)

**User Story:**
As a productivity enthusiast, I want a dedicated Pomodoro timer that automatically alternates between work and break intervals so that I can follow the Pomodoro Technique without manual timer management.

**Success Criteria:**
- [ ] New "Pomodoro" tab or mode accessible from navigation
- [ ] Default cycle: 25m work / 5m short break / 15m long break (after 4 work sessions)
- [ ] All durations configurable in Pomodoro settings
- [ ] Automatic transition from work to break (and vice versa) with notification
- [ ] Visual distinction between work and break phases (color coding)
- [ ] Session counter shows "Session 3 of 4" progress
- [ ] Optional auto-start for next phase (configurable: manual start vs auto-start)
- [ ] Pomodoro history: completed sessions logged with timestamps

**Technical Approach:**
- Create `usePomodoroStore` Zustand store with phase state machine: WORK -> SHORT_BREAK -> WORK -> ... -> LONG_BREAK
- New `PomodoroView` component with large central timer, phase indicator, session dots
- Reuse existing `useAlarm` for phase transitions
- Store Pomodoro config in settings store
- Log completed sessions to a `pomodoroHistory` array in store (persisted)

**Dependencies:** Background Timer Reliability (v1.1), Notification Support (v1.1)
**Risks:** Medium. State machine complexity; must handle edge cases (pause during break, reset mid-cycle).

---

#### Feature 1.5.2: Sequential Timers

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a user, I want to chain multiple timers together so that when one finishes, the next one starts automatically -- useful for multi-step recipes, workout circuits, or meeting segments.

**Success Criteria:**
- [ ] "Create Sequence" option that lets user add 2+ timers in order
- [ ] Sequence displays as a horizontal progress bar showing all steps
- [ ] When one timer completes, next timer starts automatically (with brief notification)
- [ ] User can pause/resume the entire sequence
- [ ] User can skip to next step
- [ ] Sequence state persists across page refreshes

**Technical Approach:**
- Add `TimerSequence` type: `{ id: string, name: string, steps: Timer[], currentStep: number, status: SequenceStatus }`
- New `useSequenceStore` or extend timersStore
- `SequenceCard` component showing step progress and current timer
- On step completion: auto-advance `currentStep` and start next timer

**Dependencies:** None (but benefits from Notification Support)
**Risks:** Medium. UI complexity for displaying sequence state clearly on mobile.

---

#### Feature 1.5.3: Interval Timers

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a fitness user, I want to set up interval timers with alternating work/rest periods so that I can do HIIT, Tabata, or circuit training without manual timer resets.

**Success Criteria:**
- [ ] Configure: work duration, rest duration, number of rounds, warm-up time, cool-down time
- [ ] Visual display of current phase (WARM UP / WORK / REST / COOL DOWN / DONE)
- [ ] Round counter: "Round 3 of 8"
- [ ] Audio cue distinguishes work start from rest start (different tones)
- [ ] Large, fullscreen-friendly display for gym use

**Technical Approach:**
- Create `IntervalTimer` type extending the sequence concept
- State machine: WARMUP -> (WORK -> REST) x N -> COOLDOWN -> DONE
- Reuse alarm system with configurable tone per phase
- Component sized for readability at distance

**Dependencies:** Sound Variety (v1.1), Sequential Timers (v1.5.2)
**Risks:** Low. Well-understood pattern.

---

#### Feature 1.5.4: Auto-Repeat

**Priority:** LOW
**Effort:** S (Small)

**User Story:**
As a user, I want a timer to automatically restart when it completes so that I can use it for recurring intervals without pressing reset each time.

**Success Criteria:**
- [ ] "Repeat" toggle on timer creation/edit dialog
- [ ] When repeat is on, completed timer resets and starts again automatically
- [ ] Repeat count shown: "Cycle 3" (or unlimited)
- [ ] Optional maximum repeat count
- [ ] Repeat off by default

**Technical Approach:**
- Add `repeat: boolean` and `maxRepeats: number | null` to Timer type
- Add `repeatCount: number` to track current cycle
- Modify `tickTimers` completion logic: if repeat is on, reset and restart instead of completing

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.5.5: Session History

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a user, I want to see a history of completed timers and Pomodoro sessions so that I can track my time usage patterns over days and weeks.

**Success Criteria:**
- [ ] New "History" tab or section showing completed timers
- [ ] Each entry shows: timer label, duration, start time, end time, date
- [ ] Grouped by day with daily totals
- [ ] Last 30 days of history retained (older data auto-pruned)
- [ ] Simple stats: total time tracked today, this week, top 5 timer labels by frequency
- [ ] Clear history option

**Technical Approach:**
- Create `useHistoryStore` with persisted array of `CompletedSession` records
- On timer completion: append session record to history
- `HistoryView` component with date-grouped list and summary stats
- Use IndexedDB (via `idb` library) instead of localStorage for history to avoid quota issues

**Dependencies:** None
**Risks:** Medium. IndexedDB is more complex than localStorage; need migration strategy.

---

#### Feature 1.5.6: Fullscreen Mode

**Priority:** MEDIUM
**Effort:** S (Small)

**User Story:**
As a presenter or fitness user, I want to display a single timer in fullscreen so that it is visible from across the room.

**Success Criteria:**
- [ ] "Fullscreen" button on each timer card
- [ ] Fullscreen view shows: timer label, large countdown text (filling viewport), progress ring, minimal controls (pause/resume, exit fullscreen)
- [ ] Uses Fullscreen API (`element.requestFullscreen()`)
- [ ] Escape key exits fullscreen
- [ ] Works on mobile (landscape orientation lock suggested)

**Technical Approach:**
- Create `FullscreenTimer` component
- Use `document.documentElement.requestFullscreen()` API
- Scale text with `vw`/`vh` units for maximum readability
- Minimal dark UI to reduce distractions

**Dependencies:** None
**Risks:** Low. Fullscreen API is well-supported.

---

#### Feature 1.5.7: Export/Import

**Priority:** MEDIUM
**Effort:** S (Small)

**User Story:**
As a user, I want to export my timers and events as a file and import them on another device so that I can back up my data or transfer it.

**Success Criteria:**
- [ ] "Export" button in Settings downloads a JSON file containing all timers, events, and settings
- [ ] "Import" button in Settings accepts a JSON file and merges/replaces data
- [ ] Import validates schema before applying (shows error if invalid)
- [ ] User chooses: "Merge with existing" or "Replace all"
- [ ] Export filename includes date: `countdown-backup-2026-02-08.json`

**Technical Approach:**
- Export: gather state from all 3 stores, `JSON.stringify`, create `Blob`, trigger download via `URL.createObjectURL`
- Import: `<input type="file" accept=".json">`, parse, validate with Zod schema (already a dependency via Zustand), apply to stores
- Add import/export buttons to SettingsDialog

**Dependencies:** None
**Risks:** Low.

---

#### Feature 1.5.8: Timer Templates

**Priority:** LOW
**Effort:** S (Small)

**User Story:**
As a frequent user, I want to save my timer configurations as reusable templates so that I can create commonly used timers with one tap.

**Success Criteria:**
- [ ] "Save as Template" option on any existing timer
- [ ] Templates section in "New Timer" dialog or as a dedicated view
- [ ] Template includes: label, duration, optional repeat setting
- [ ] Templates are editable and deletable
- [ ] Maximum 50 templates

**Technical Approach:**
- Add `useTemplateStore` with persisted array
- Template is a simplified Timer without runtime state (id, label, h, m, s, repeat)
- "Use Template" creates a new timer from template and optionally starts it

**Dependencies:** Timer Presets (v1.1)
**Risks:** Low.

---

#### Feature 1.5.9: Quick-Start UI

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a new or returning user, I want to start a timer from the home screen with minimal taps -- ideally a single interaction for common durations.

**Success Criteria:**
- [ ] Home screen shows preset chips prominently (above timer grid)
- [ ] Recent timers section: last 5 timers shown as quick-restart cards
- [ ] Tapping a recent timer creates a new instance with same duration and starts it
- [ ] "Quick Timer" input: type a number (e.g., "5") and hit Enter to start a 5-minute timer
- [ ] Natural language support: "5m", "1h30m", "90s" parsed into duration

**Technical Approach:**
- Create `QuickStartBar` component with preset chips + recent timers + text input
- Parse natural language with simple regex: `/^(\d+)\s*(h|m|s|hr|min|sec)/`
- Recent timers derived from history store or timer store (last 5 unique labels)

**Dependencies:** Timer Presets (v1.1), Session History (v1.5.5)
**Risks:** Low. Natural language parsing scope must be limited to avoid complexity.

---

#### v1.5 Release Summary

| Feature | Priority | Effort | Risk |
|---------|----------|--------|------|
| Pomodoro Mode | HIGH | L | MEDIUM |
| Sequential Timers | MEDIUM | M | MEDIUM |
| Interval Timers | MEDIUM | M | LOW |
| Auto-Repeat | LOW | S | LOW |
| Session History | MEDIUM | M | MEDIUM |
| Fullscreen Mode | MEDIUM | S | LOW |
| Export/Import | MEDIUM | S | LOW |
| Timer Templates | LOW | S | LOW |
| Quick-Start UI | MEDIUM | M | LOW |

**Total effort estimate:** 8-10 weeks (1 developer)
**Critical path:** Pomodoro Mode (depends on v1.1 notifications) --> Session History --> Quick-Start UI

---

### v2.0 - Growth & Collaboration (12-16 weeks)

**Theme:** "Enable sharing and insights"

**Release Goal:** Introduce a backend, user accounts, cloud sync, sharing, analytics, and a premium tier. This release transforms the app from a local tool into a connected product with a business model.

---

#### Feature 2.0.1: Cloud Sync

**Priority:** HIGH
**Effort:** XL (Extra Large)

**User Story:**
As a user with multiple devices, I want my timers, events, templates, and settings to sync across all my devices so that I have the same experience everywhere.

**Success Criteria:**
- [ ] User can create an account (email + password, or OAuth via Google/GitHub)
- [ ] All stores (timers, events, settings, templates, Pomodoro config) sync to cloud
- [ ] Sync is near-real-time (< 5 seconds)
- [ ] Conflict resolution: last-write-wins with device timestamp
- [ ] Offline-first: app works without network, syncs when reconnected
- [ ] "Sign out" clears cloud-synced data from device (local-only data remains)
- [ ] Account deletion removes all server-side data

**Technical Approach:**
- Backend: Supabase (PostgreSQL + Auth + Realtime subscriptions)
- Auth: Supabase Auth with email/password + Google OAuth
- Schema: `users`, `timers`, `events`, `settings`, `templates` tables with `user_id` foreign key
- Sync: Supabase Realtime for live updates; offline queue for pending changes
- Migration: on first sign-in, offer to upload existing localStorage data to cloud

**Dependencies:** None (greenfield backend)
**Risks:** HIGH. First server-side code. Auth security, data privacy, GDPR compliance, sync conflict resolution.

---

#### Feature 2.0.2: Share Timer via URL

**Priority:** MEDIUM
**Effort:** M (Medium)

**User Story:**
As a user, I want to share a timer configuration via a URL so that a friend or colleague can open it and start the same timer instantly.

**Success Criteria:**
- [ ] "Share" button on each timer card generates a shareable URL
- [ ] URL contains timer config encoded in query params or short hash
- [ ] Opening the URL on any device loads the timer and offers "Start Timer" CTA
- [ ] No account required to use a shared timer
- [ ] Shared timer is a copy (modifications do not affect the original)

**Technical Approach:**
- Encode timer config in URL: `https://app.com/t?l=Laundry&d=1800` (label + duration in seconds)
- On load: parse query params, show "Shared Timer: Laundry (30:00) -- Start?" dialog
- Optional: short URL via server-side redirect (requires backend from 2.0.1)

**Dependencies:** Cloud Sync (2.0.1) for short URLs; works without backend via query params
**Risks:** Low for query param approach. Medium for short URL backend.

---

#### Feature 2.0.3: Basic Analytics Dashboard

**Priority:** MEDIUM
**Effort:** L (Large)

**User Story:**
As a productivity-focused user, I want to see visual charts of my timer usage over time so that I can understand my time management patterns and improve.

**Success Criteria:**
- [ ] Dashboard tab showing usage analytics
- [ ] Charts: daily timer usage (bar chart), category breakdown (pie chart), streak tracker (calendar heatmap)
- [ ] Time range selector: Today, This Week, This Month, All Time
- [ ] Data sourced from session history (v1.5.5)
- [ ] Charts render client-side (no analytics backend needed)
- [ ] Export analytics as PNG or CSV

**Technical Approach:**
- Use lightweight chart library: Recharts or Chart.js (tree-shakeable)
- Data aggregation from history store
- `AnalyticsDashboard` component with responsive grid of chart cards
- Keep bundle impact < 30KB gzipped

**Dependencies:** Session History (v1.5.5), Cloud Sync (2.0.1) for cross-device data
**Risks:** Medium. Chart library bundle size. Mobile chart readability.

---

#### Feature 2.0.4: Premium Tier

**Priority:** HIGH
**Effort:** L (Large)

**User Story:**
As a power user, I want to unlock advanced features through a premium subscription so that I can access cloud sync, analytics, and unlimited templates.

**Success Criteria:**
- [ ] Upgrade flow: in-app prompt on premium feature access
- [ ] Payment processing via Stripe Checkout or Paddle
- [ ] Premium features gated: cloud sync, analytics dashboard, unlimited templates, custom alarm sounds, advanced Pomodoro stats
- [ ] Free tier remains fully functional for core use (unlimited timers, events, presets, basic Pomodoro)
- [ ] Subscription management (cancel, billing history) via Stripe Customer Portal
- [ ] 7-day free trial for premium

**Technical Approach:**
- Stripe Checkout for payment (no need to handle card data directly)
- Store subscription status in Supabase `subscriptions` table
- Client checks `isPremium` flag from auth context
- Premium feature components wrapped in `<PremiumGate>` component that shows upgrade prompt for free users

**Dependencies:** Cloud Sync (2.0.1) for user accounts
**Risks:** HIGH. Payment integration complexity, subscription lifecycle management, refund handling.

---

#### Feature 2.0.5: Timer Categories/Tags

**Priority:** LOW
**Effort:** S (Small)

**User Story:**
As a user with many timers, I want to categorize timers with tags (e.g., "Work", "Cooking", "Exercise") so that I can filter and organize them.

**Success Criteria:**
- [ ] Timers and events can have 0-3 tags
- [ ] Tag selector in create/edit dialog (pick from existing or create new)
- [ ] Filter bar above timer grid: show all, or filter by tag
- [ ] Tags displayed as colored chips on timer cards
- [ ] Analytics breakdown by tag (v2.0.3)

**Technical Approach:**
- Add `tags: string[]` to Timer and CountdownEvent types
- `useTagStore` with list of user-defined tags (name, color)
- Filter state in TimerList/EventList components

**Dependencies:** None
**Risks:** Low.

---

#### Feature 2.0.6: Widget Support

**Priority:** LOW
**Effort:** L (Large)

**User Story:**
As a mobile user, I want a home screen widget showing my active timer so that I can see the countdown without opening the app.

**Success Criteria:**
- [ ] Android: PWA widget via Web App Manifest widget definition (experimental)
- [ ] Fallback: "Add to Home Screen" shortcut for quick access
- [ ] Widget shows: label, remaining time, progress bar
- [ ] Tapping widget opens app to that timer

**Technical Approach:**
- Explore PWA Widget API (experimental, limited browser support)
- Practical approach: focus on making the PWA launch experience fast (< 1s to interactive)
- Consider future native app (v3.0+) for proper widget support

**Dependencies:** PWA Support (v1.1)
**Risks:** HIGH. PWA widget API is experimental and poorly supported. May need to defer to native app.

---

#### Feature 2.0.7: Calendar Integration

**Priority:** LOW
**Effort:** M (Medium)

**User Story:**
As an event tracker, I want to import events from my Google Calendar so that I can see countdowns to calendar events without manual entry.

**Success Criteria:**
- [ ] "Import from Google Calendar" button in Events
- [ ] OAuth flow to connect Google Calendar
- [ ] Show upcoming events (next 30 days) as import candidates
- [ ] Selected events become countdown events
- [ ] One-time import (not live sync)

**Technical Approach:**
- Google Calendar API v3 with OAuth 2.0
- Server-side token exchange via Supabase Edge Functions
- Client fetches events and presents selection UI
- Selected events converted to CountdownEvent records

**Dependencies:** Cloud Sync (2.0.1) for OAuth infrastructure
**Risks:** Medium. Google API quota, OAuth complexity, user trust for calendar access.

---

#### Feature 2.0.8: Advanced Theming

**Priority:** LOW
**Effort:** M (Medium)

**User Story:**
As a user who values personalization, I want to customize the app's colors, fonts, and accent colors beyond light/dark mode.

**Success Criteria:**
- [ ] Color picker for primary and accent colors
- [ ] 5-6 curated theme presets (Ocean, Forest, Sunset, Midnight, Minimal, Neon)
- [ ] Font size adjustment (small, medium, large)
- [ ] Theme preview before applying
- [ ] Custom themes sync via cloud (premium feature)

**Technical Approach:**
- Extend Settings store with `customPrimary`, `customSecondary`, `fontSize` fields
- Dynamically generate MUI theme from user colors using `createTheme()`
- Preset themes as predefined color palettes
- Font size: adjust MUI typography scale

**Dependencies:** Premium Tier (2.0.4) for cloud-synced custom themes
**Risks:** Low.

---

#### v2.0 Release Summary

| Feature | Priority | Effort | Risk |
|---------|----------|--------|------|
| Cloud Sync | HIGH | XL | HIGH |
| Share Timer via URL | MEDIUM | M | LOW |
| Basic Analytics Dashboard | MEDIUM | L | MEDIUM |
| Premium Tier | HIGH | L | HIGH |
| Timer Categories/Tags | LOW | S | LOW |
| Widget Support | LOW | L | HIGH |
| Calendar Integration | LOW | M | MEDIUM |
| Advanced Theming | LOW | M | LOW |

**Total effort estimate:** 12-16 weeks (1-2 developers)
**Critical path:** Cloud Sync --> Premium Tier --> Analytics Dashboard

---

## 5. Post-v2.0 Backlog (Future Considerations)

These features are acknowledged but not scheduled. They will be evaluated based on user feedback, business metrics, and market positioning after v2.0.

| Feature | Rationale | Estimated Effort |
|---------|-----------|------------------|
| **Native Mobile Apps (iOS/Android)** | PWA covers most cases, but native apps unlock widgets, background execution, and App Store distribution. Consider React Native or Expo for code sharing. | XL (12+ weeks) |
| **Team Collaboration Rooms** | Shared timers for meetings, classrooms, and remote standups. Real-time sync via WebSocket. Requires v2.0 backend. | L (8 weeks) |
| **Advanced Gamification** | Streaks, badges, daily challenges, XP system. Boosts retention but risks cheapening the utility-focused brand. | M (4 weeks) |
| **Integrations (Slack, Notion, Calendar)** | "Start a 25m timer" from Slack. Webhook-based. High value for team persona. | M per integration |
| **Custom Sound Uploads** | Let users upload their own alarm sounds (MP3/WAV). Requires storage (Supabase Storage). Premium feature. | S (2 weeks) |
| **Time Blocking** | Full-day schedule view with draggable time blocks. Competes with calendar apps; may be out of scope. | XL |
| **Advanced Analytics & AI Insights** | ML-based productivity insights: "You're most productive between 9-11am." Requires significant data and computation. | XL |
| **Localization (i18n)** | Support 10+ languages. Significant effort for ongoing translation maintenance. | L (6 weeks initial + ongoing) |
| **Accessibility Audit (WCAG AAA)** | Go beyond AA compliance for maximum inclusivity. | M (4 weeks) |
| **Apple Watch / WearOS Companion** | Timer on your wrist. Requires native development. | L per platform |

---

## 6. Non-Goals (Explicit Exclusions)

| Non-Goal | Reasoning |
|----------|-----------|
| **Real-time multiplayer timers** | Adds enormous backend complexity (WebSocket, conflict resolution). Collaboration rooms (post-v2.0) will cover group use cases more simply. |
| **Stopwatch / count-up timer** | Fundamentally different product. Count-up timers have no alarm trigger and serve a different mental model. Would dilute the countdown-focused experience. |
| **Project management / task tracking** | Timer labels serve as lightweight task identifiers. Full task management (assignees, due dates, priorities) is a different product. Integrate with existing tools instead. |
| **Social features (profiles, followers, leaderboards)** | Timers are a personal utility. Social pressure mechanics conflict with the "quiet until needed" design principle. |
| **Electron desktop app** | PWA provides sufficient desktop experience. Electron adds 100MB+ download, auto-update complexity, and maintenance burden for marginal benefit. |
| **Self-hosted option** | The app works fully offline in the browser. Self-hosting adds documentation burden and support complexity with no clear user demand. |
| **White-label / enterprise** | Focus on individual users and small teams first. Enterprise features (SSO, admin panel, audit logs) are premature before product-market fit. |

---

## 7. Success Metrics by Release

| Metric | v1.0 (Current) | v1.1 Target | v1.5 Target | v2.0 Target |
|--------|-----------------|-------------|-------------|-------------|
| **Weekly Active Timer Starts** | Unmeasured | 500 | 2,000 | 10,000 |
| **Monthly Active Users** | Unmeasured | 200 | 1,000 | 5,000 |
| **7-Day Return Rate** | Unmeasured | 20% | 35% | 50% |
| **Avg Session Duration** | Unmeasured | 2 min | 5 min | 8 min |
| **Timers per Session** | Unmeasured | 1.5 | 2.5 | 3.0 |
| **PWA Installs** | 0 | 50 | 200 | 1,000 |
| **Lighthouse Performance** | Unmeasured | >= 90 | >= 90 | >= 85 |
| **Lighthouse Accessibility** | Unmeasured | >= 90 | >= 95 | >= 95 |
| **Lighthouse PWA** | 0 | >= 90 | >= 95 | >= 95 |
| **Test Coverage** | 0% | >= 70% (stores/utils) | >= 80% | >= 80% |
| **Bundle Size (gzipped)** | ~50KB | < 70KB | < 100KB | < 150KB |
| **Premium Subscribers** | N/A | N/A | N/A | 100 |
| **Monthly Revenue** | $0 | $0 | $0 | $500 |

**How to Measure:**
- User metrics: PostHog (free tier, privacy-friendly) or Plausible Analytics (v1.5+)
- Performance: Lighthouse CI in GitHub Actions
- Business: Stripe Dashboard

---

## 8. Technical Architecture Evolution

### v1.1: Client Hardening

```
Browser (Client-Only)
|
+-- React 19 + TypeScript 5.9
+-- Vite 7 + vite-plugin-pwa
+-- MUI 7 (tree-shaken)
+-- Zustand 5 + persist (localStorage)
+-- Service Worker (Workbox - asset caching)
+-- Notification API (foreground)
+-- Web Audio API (synthesized alarms)
+-- Vitest + React Testing Library
+-- GitHub Actions CI (lint + typecheck + test)
```

**Key additions:**
- Service Worker for offline caching (via vite-plugin-pwa)
- PWA manifest with icons
- Notification API for background alerts
- Vitest test suite
- CI pipeline

### v1.5: Richer Client

```
Browser (Client-Only, Enhanced)
|
+-- Everything from v1.1
+-- IndexedDB (via idb library) for session history
+-- Pomodoro state machine (separate store)
+-- Sequence/interval timer engine
+-- Recharts (analytics charts, lightweight)
+-- Performance budget: < 100KB gzipped
+-- Timer limit increased: 100 timers, 200 events
```

**Key additions:**
- IndexedDB for large data sets (history can grow indefinitely, unlike localStorage)
- More complex state machines (Pomodoro, sequences)
- Chart rendering library
- Increased storage limits

### v2.0: Client + Backend

```
Browser (Client)                    Supabase (Backend)
|                                   |
+-- Everything from v1.5            +-- PostgreSQL
+-- Supabase Client SDK             |   +-- users table
+-- Auth context (JWT)              |   +-- timers table
+-- Sync engine (offline queue)     |   +-- events table
+-- Stripe.js (payment UI)         |   +-- settings table
+-- Google Calendar API client      |   +-- templates table
                                    |   +-- subscriptions table
                                    |   +-- sessions_history table
                                    |
                                    +-- Supabase Auth
                                    |   +-- Email/password
                                    |   +-- Google OAuth
                                    |
                                    +-- Supabase Realtime
                                    |   +-- Live sync subscriptions
                                    |
                                    +-- Supabase Edge Functions
                                    |   +-- Stripe webhook handler
                                    |   +-- Google Calendar token exchange
                                    |
                                    +-- Supabase Storage (future)
                                        +-- Custom alarm sounds
```

**Key additions:**
- Supabase backend (PostgreSQL, Auth, Realtime, Edge Functions)
- Authentication flow
- Offline-first sync engine with conflict resolution
- Stripe payment integration
- Google Calendar API integration

---

## 9. Monetization Strategy

### Free Tier (Forever Free)

All core functionality remains free:
- Unlimited timers and events
- Timer presets and custom presets
- Pomodoro mode (basic)
- Sequential and interval timers
- Auto-repeat
- PWA installation
- Keyboard shortcuts
- All 4 built-in alarm sounds
- Light/dark/system theme
- Export/import (JSON)
- Fullscreen mode
- Basic session history (last 7 days)
- Share timer via URL

### Premium Tier

**Pricing:** $3.99/month or $29.99/year (37% discount) or $79.99 lifetime

**Premium features:**
- Cloud sync across unlimited devices
- Full analytics dashboard with charts
- Session history (unlimited retention)
- Timer categories/tags
- Advanced Pomodoro statistics
- Custom theme colors and curated presets
- Custom alarm sound uploads (future)
- Calendar integration
- Priority support
- Early access to new features

### Pricing Justification

| Competitor | Price | Features |
|-----------|-------|----------|
| Toggl Track (Personal) | $9/month | Full time tracking + reporting |
| Focus Keeper Pro | $4.99 one-time (iOS) | Pomodoro timer + history |
| Forest Premium | $3.99 one-time (mobile) | Focus timer + gamification |
| Be Focused Pro | $4.99 one-time (macOS) | Pomodoro + task management |

At $3.99/month, the app is positioned below Toggl but above one-time purchase timer apps. The annual plan at $29.99/year ($2.50/month effective) is competitive with one-time purchase alternatives while providing ongoing cloud sync and updates.

### Revenue Projections (Conservative)

| Quarter | MAU | Premium Conversion | Subscribers | MRR |
|---------|-----|-------------------|-------------|-----|
| v2.0 Launch (Q1) | 5,000 | 2% | 100 | $400 |
| Q2 | 8,000 | 2.5% | 200 | $800 |
| Q3 | 12,000 | 3% | 360 | $1,440 |
| Q4 | 18,000 | 3% | 540 | $2,160 |
| Year 1 Total | -- | -- | -- | ~$14,400 ARR |

**Break-even analysis:**
- Supabase: $25/month (Pro plan)
- Vercel: $0 (Hobby) or $20/month (Pro)
- Stripe fees: 2.9% + $0.30 per transaction
- Domain + misc: $20/year
- Total monthly cost: ~$50-75/month
- Break-even: ~15-20 premium subscribers

---

## 10. Risk Mitigation

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| 1 | **Background timers do not work on iOS Safari** | HIGH | HIGH | Use `visibilitychange` event to catch up when tab regains focus. Show clear warning to iOS users. Test on iOS 16.4+ which added Web Push support. Provide best-effort Notification API. Long-term: native iOS app. |
| 2 | **Users do not adopt premium features** | HIGH | MEDIUM | Validate feature demand before building. Run a "premium interest" survey at v1.5 launch. Consider lower price point or lifetime-only model. Ensure free tier is strong enough for organic growth. |
| 3 | **Performance degrades with many timers** | MEDIUM | LOW | Profile with 100+ timers. Virtualize timer list with `react-window` if needed. Batch store updates. Current 250ms tick is efficient; only running timers are checked. |
| 4 | **Supabase vendor lock-in** | MEDIUM | LOW | Use Supabase client abstracted behind a sync service layer. PostgreSQL is standard; migration to self-hosted or another provider is feasible. |
| 5 | **Bundle size bloat from MUI + charts** | MEDIUM | MEDIUM | Monitor bundle with `vite-plugin-bundle-visualizer`. Tree-shake MUI imports (already done). Choose Recharts over Chart.js (smaller). Set hard budget: 150KB gzipped max. |
| 6 | **Auth/payment security vulnerabilities** | HIGH | LOW | Use Supabase Auth (battle-tested). Use Stripe Checkout (PCI compliant, no card data on our servers). Security audit before v2.0 launch. |
| 7 | **Single developer bus factor** | HIGH | MEDIUM | Maintain comprehensive documentation (this roadmap, AGENTS.md, inline code comments). Write tests. Use standard patterns (Zustand, MUI) that any React developer can pick up. |
| 8 | **PWA limitations on iOS** | MEDIUM | HIGH | Document known iOS limitations clearly. PWA on iOS lacks push notifications (pre-16.4), background sync, and badge API. Recommend "Add to Home Screen" with caveats. |
| 9 | **Scope creep in v1.5 workflows** | MEDIUM | MEDIUM | Timebox Pomodoro to 2 weeks max. Ship MVP of each workflow feature; iterate based on usage data. Cut low-priority features (templates, auto-repeat) if behind schedule. |
| 10 | **Data loss from localStorage clearing** | HIGH | LOW | Prompt users to enable cloud sync (v2.0) or export data (v1.5). Show warning when storage usage exceeds 80% of quota. Migrate history to IndexedDB in v1.5. |

---

## 11. Open Questions & Decisions Needed

| # | Question | Options | Recommendation | Decision By |
|---|----------|---------|----------------|-------------|
| 1 | **Backend provider** | Firebase vs Supabase vs custom (Node.js + PostgreSQL) | **Supabase** -- PostgreSQL, generous free tier, built-in auth + realtime, open source, less lock-in than Firebase | Before v2.0 planning |
| 2 | **Authentication methods** | Email only / Email + Google / Email + Google + GitHub + Apple | **Email + Google OAuth** -- covers 95% of users. Add Apple Sign-In if iOS app is built. | Before v2.0 development |
| 3 | **Premium pricing model** | $3.99/mo / $4.99/mo / $29.99 lifetime only / freemium with ads | **$3.99/mo or $29.99/year** -- no ads (ads conflict with "calm" design principle). Lifetime at $79.99 to capture one-time buyers. | Before v2.0 launch |
| 4 | **Analytics provider** | PostHog (self-hosted option) vs Plausible (privacy-first) vs Mixpanel vs no analytics | **Plausible** for page analytics (privacy-first, no cookie banner needed). **PostHog** if product analytics (funnels, feature flags) needed. | Before v1.5 (when we want to measure) |
| 5 | **Chart library for analytics dashboard** | Recharts vs Chart.js vs Nivo vs custom SVG | **Recharts** -- React-native, tree-shakeable, good DX, reasonable bundle size (~40KB gzipped) | Before v2.0 analytics feature |
| 6 | **Native mobile app timing** | After v2.0 / Never (PWA only) / Parallel with v2.0 | **After v2.0** -- validate demand with PWA first. If >30% traffic is mobile and PWA limitations cause significant churn, pursue native. | After v2.0 metrics review |
| 7 | **Test framework** | Vitest vs Jest | **Vitest** -- native Vite integration, faster, compatible API, already using Vite | Before v1.1 test work |
| 8 | **Pomodoro: separate tab or mode toggle?** | New navigation tab / Mode toggle within Timers tab / Separate route | **New navigation tab** -- cleanest UX, does not clutter Timers or Events. Adds "Pomodoro" between "Timers" and "Events". | Before v1.5 development |
| 9 | **IndexedDB library** | idb (lightweight wrapper) vs Dexie.js (full ORM) vs raw API | **idb** -- tiny (~1KB), sufficient for our needs (key-value + simple queries) | Before v1.5 history feature |
| 10 | **Domain name** | Keep Vercel subdomain vs custom domain | **Custom domain** before v2.0 launch (e.g., countdowntimer.app, timerflow.app). Essential for brand credibility and premium positioning. | Before v2.0 marketing |

---

## 12. Dependencies & Prerequisites

### v1.1 Prerequisites

| Dependency | Status | Action Needed |
|------------|--------|---------------|
| App icon design (192px, 512px, favicon) | NOT STARTED | Design or generate icons for PWA manifest |
| vite-plugin-pwa | NOT INSTALLED | `npm install vite-plugin-pwa` |
| Vitest + RTL | NOT INSTALLED | `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` |
| GitHub Actions CI | NOT SET UP | Create `.github/workflows/ci.yml` |
| Lighthouse CI | NOT SET UP | Add to CI pipeline or use manual audits |

### v1.5 Prerequisites

| Dependency | Status | Action Needed |
|------------|--------|---------------|
| idb library | NOT INSTALLED | `npm install idb` |
| Recharts (if analytics preview) | NOT INSTALLED | Evaluate bundle size first |
| Pomodoro UX design | NOT STARTED | Wireframe Pomodoro tab layout |
| Analytics provider account | NOT SET UP | Create Plausible or PostHog account |

### v2.0 Prerequisites

| Dependency | Status | Action Needed |
|------------|--------|---------------|
| Supabase project | NOT CREATED | Create project, define schema, set up RLS policies |
| Supabase client SDK | NOT INSTALLED | `npm install @supabase/supabase-js` |
| Stripe account | NOT CREATED | Register, verify, configure products/prices |
| Stripe.js | NOT INSTALLED | `npm install @stripe/stripe-js` |
| Google Cloud project (Calendar API) | NOT CREATED | Create project, enable Calendar API, configure OAuth consent screen |
| Custom domain | NOT PURCHASED | Register domain, configure DNS |
| Privacy policy & Terms of Service | NOT WRITTEN | Required for auth, payments, and Google OAuth |
| App store accounts (if native) | NOT CREATED | Apple Developer ($99/yr), Google Play ($25 one-time) |
| Payment processing entity | NOT SET UP | May need business entity for Stripe depending on jurisdiction |

---

## 13. Release Schedule

### v1.1 - Polish & Foundation

| Milestone | Target Date | Go/No-Go Criteria |
|-----------|-------------|-------------------|
| Planning complete | Week 1 | All features have specs, PRD reviewed |
| Development start | Week 2 | Dev environment set up, CI pipeline running |
| Background timer + notifications | Week 3 | Timer alarm fires in backgrounded tab on Chrome, Firefox, Safari |
| PWA + Service Worker | Week 4 | Lighthouse PWA >= 90, app installable |
| Keyboard shortcuts + Accessibility | Week 5 | WCAG AA audit passes, keyboard navigation works end-to-end |
| Presets + Sound variety + Undo + Tests | Week 5-6 | All unit tests pass, >= 70% coverage on stores/utils |
| QA + Bug fixes | Week 6 | Manual test checklist passes on Chrome, Firefox, Safari, mobile |
| **Release** | **Week 6** | All go/no-go criteria met. Lighthouse Performance >= 90, Accessibility >= 90, PWA >= 90 |

### v1.5 - Workflows

| Milestone | Target Date | Go/No-Go Criteria |
|-----------|-------------|-------------------|
| Planning + UX design | Week 7-8 | Pomodoro wireframes approved, feature specs complete |
| Pomodoro mode | Week 9-11 | Full Pomodoro cycle works with auto-transition and history |
| Sequential + Interval timers | Week 12-13 | Sequences run to completion, intervals alternate correctly |
| Session history + IndexedDB | Week 14 | 30 days of history displayed, data persists after clear-cache |
| Quick-start UI + Templates | Week 15 | Natural language parsing works for common formats |
| Fullscreen + Export/Import | Week 15-16 | Fullscreen mode works, round-trip export/import verified |
| Analytics integration | Week 16 | Plausible/PostHog tracking live, basic funnel defined |
| QA + Bug fixes | Week 17 | All features pass manual + automated tests |
| **Release** | **Week 17** | All go/no-go criteria met. >= 80% test coverage. |

### v2.0 - Growth & Collaboration

| Milestone | Target Date | Go/No-Go Criteria |
|-----------|-------------|-------------------|
| Backend design + Supabase setup | Week 18-19 | Schema defined, RLS policies tested, auth flow working |
| Cloud sync + Auth | Week 20-24 | Sign up, sign in, data syncs across 2 devices in < 5s |
| Stripe integration + Premium tier | Week 25-28 | Payment flow works end-to-end, subscription lifecycle correct |
| Analytics dashboard | Week 29-31 | Charts render with real data, responsive on mobile |
| Sharing + Tags + Theming | Week 32-33 | Share URL works, tags filter correctly, custom themes apply |
| Security audit | Week 33 | No critical vulnerabilities in auth, payment, or data access |
| QA + Bug fixes + Performance | Week 34 | All features pass, Lighthouse >= 85 performance (slightly heavier due to backend SDK) |
| **Release** | **Week 34** | All go/no-go criteria met. Security audit passed. Legal docs published. |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **WATS** | Weekly Active Timer Starts -- north star metric |
| **MAU** | Monthly Active Users |
| **MRR** | Monthly Recurring Revenue |
| **ARR** | Annual Recurring Revenue |
| **PWA** | Progressive Web App |
| **RAF** | requestAnimationFrame |
| **RLS** | Row Level Security (Supabase/PostgreSQL) |
| **WCAG** | Web Content Accessibility Guidelines |
| **Pomodoro** | Time management technique: 25 min work, 5 min break, repeat |
| **HIIT** | High-Intensity Interval Training |

---

## Appendix B: Competitive Landscape

| Product | Platform | Free Tier | Pricing | Key Differentiator |
|---------|----------|-----------|---------|-------------------|
| **Timer Tab** | Web | Full | Free | Simple, one timer at a time |
| **Pomofocus** | Web | Full | $3/mo premium | Pomodoro-focused, task integration |
| **Toggl Track** | Web + Apps | Limited | $9/mo | Full time tracking + reporting |
| **Focus Keeper** | iOS | Limited | $4.99 one-time | Pomodoro, minimal, well-designed |
| **Forest** | iOS + Android | Limited | $3.99 one-time | Gamification, plant trees while focusing |
| **Google Timer** | Web (search) | Full | Free | Instant, no features |
| **Countdown Timer (ours)** | Web (PWA) | Full | $3.99/mo premium | Multiple timers, events, workflows, beautiful UI |

**Our competitive advantage:**
1. Multi-timer support (most competitors are single-timer)
2. Event countdowns + timers in one app
3. No install required (PWA, works in browser)
4. Material Design 3 polish
5. Free forever for core use
6. Fully offline-capable

---

*This document is a living roadmap. It should be revisited monthly and updated based on user feedback, metrics, and market changes.*
