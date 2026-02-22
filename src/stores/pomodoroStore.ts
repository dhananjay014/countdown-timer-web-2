import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  PomodoroPhase,
  PomodoroStatus,
  PomodoroConfig,
  PomodoroSession,
  PomodoroState,
} from '../types/pomodoro';
import { generateId } from '../utils/timeCalculations';

export const DEFAULT_CONFIG: PomodoroConfig = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLong: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

export function getPhaseDuration(phase: PomodoroPhase, config: PomodoroConfig): number {
  switch (phase) {
    case 'work':
      return config.workMinutes * 60;
    case 'shortBreak':
      return config.shortBreakMinutes * 60;
    case 'longBreak':
      return config.longBreakMinutes * 60;
  }
}

function getNextPhase(
  phase: PomodoroPhase,
  currentSession: number,
  sessionsBeforeLong: number
): { nextPhase: PomodoroPhase; nextSession: number } {
  if (phase === 'work') {
    if (currentSession >= sessionsBeforeLong) {
      return { nextPhase: 'longBreak', nextSession: currentSession };
    }
    return { nextPhase: 'shortBreak', nextSession: currentSession };
  }
  if (phase === 'longBreak') {
    return { nextPhase: 'work', nextSession: 1 };
  }
  // shortBreak -> work
  return { nextPhase: 'work', nextSession: currentSession + 1 };
}

/** Builds the state update for transitioning from the current phase to the next. */
function buildPhaseTransition(
  state: PomodoroState,
  historyEntry: PomodoroSession | null,
): Partial<PomodoroState> {
  const { phase, currentSession, config, history, totalCompleted } = state;
  const isWork = phase === 'work';

  const newHistory = historyEntry ? [...history, historyEntry] : history;
  const newTotalCompleted = (isWork && historyEntry) ? totalCompleted + 1 : totalCompleted;

  const { nextPhase, nextSession } = getNextPhase(
    phase,
    currentSession,
    config.sessionsBeforeLong,
  );
  const nextDuration = getPhaseDuration(nextPhase, config);

  return {
    phase: nextPhase,
    currentSession: nextSession,
    totalCompleted: newTotalCompleted,
    remainingTime: nextDuration,
    history: newHistory,
  };
}

interface PomodoroActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  skipPhase: () => void;
  setConfig: (partial: Partial<PomodoroConfig>) => void;
  clearHistory: () => void;
}

type PomodoroStore = PomodoroState & PomodoroActions;

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      status: 'idle' as PomodoroStatus,
      phase: 'work' as PomodoroPhase,
      currentSession: 1,
      totalCompleted: 0,
      remainingTime: DEFAULT_CONFIG.workMinutes * 60,
      endTime: null,
      config: { ...DEFAULT_CONFIG },
      history: [] as PomodoroSession[],

      start: () =>
        set((state) => {
          if (state.status !== 'idle' && state.status !== 'paused') return state;
          return {
            status: 'running' as const,
            endTime: Date.now() + state.remainingTime * 1000,
          };
        }),

      pause: () =>
        set((state) => {
          if (state.status !== 'running' || state.endTime === null) return state;
          const remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
          return {
            status: 'paused' as const,
            remainingTime: remaining,
            endTime: null,
          };
        }),

      reset: () =>
        set((state) => ({
          status: 'idle' as const,
          phase: 'work' as const,
          currentSession: 1,
          remainingTime: state.config.workMinutes * 60,
          endTime: null,
        })),

      tick: () => {
        const state = get();
        if (state.status !== 'running' || state.endTime === null) return;

        const remaining = Math.ceil((state.endTime - Date.now()) / 1000);

        if (remaining > 0) {
          set({ remainingTime: remaining });
          return;
        }

        // Phase complete -- build history entry for work phases only
        const { phase, config } = state;
        const historyEntry: PomodoroSession | null = phase === 'work'
          ? {
              id: generateId(),
              phase,
              startedAt: state.endTime - getPhaseDuration(phase, config) * 1000,
              completedAt: Date.now(),
              durationSeconds: getPhaseDuration(phase, config),
            }
          : null;

        const transition = buildPhaseTransition(state, historyEntry);

        const shouldAutoStart =
          (transition.phase !== 'work' && config.autoStartBreaks) ||
          (transition.phase === 'work' && config.autoStartWork);

        set({
          ...transition,
          endTime: shouldAutoStart ? Date.now() + transition.remainingTime! * 1000 : null,
          status: shouldAutoStart ? 'running' : 'idle',
        });
      },

      skipPhase: () =>
        set((state) => {
          const { phase, config } = state;
          const elapsed = getPhaseDuration(phase, config) - state.remainingTime;

          const historyEntry: PomodoroSession | null = (phase === 'work' && elapsed > 0)
            ? {
                id: generateId(),
                phase,
                startedAt: Date.now() - elapsed * 1000,
                completedAt: Date.now(),
                durationSeconds: elapsed,
              }
            : null;

          return {
            ...buildPhaseTransition(state, historyEntry),
            endTime: null,
            status: 'idle' as const,
          };
        }),

      setConfig: (partial) =>
        set((state) => {
          const newConfig = { ...state.config, ...partial };
          const shouldResetTime = state.status === 'idle';
          const newRemainingTime = shouldResetTime
            ? getPhaseDuration(state.phase, newConfig)
            : state.remainingTime;

          return {
            config: newConfig,
            remainingTime: newRemainingTime,
          };
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'pomodoro',
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        config: state.config,
        history: state.history,
        totalCompleted: state.totalCompleted,
        phase: state.phase,
        currentSession: state.currentSession,
        remainingTime: state.remainingTime,
        status: state.status === 'running' ? 'paused' : state.status,
        // Exclude endTime - it will be null on reload
      }),
    }
  )
);
