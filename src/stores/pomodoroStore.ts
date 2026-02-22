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

const DEFAULT_CONFIG: PomodoroConfig = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLong: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

function getPhaseDuration(phase: PomodoroPhase, config: PomodoroConfig): number {
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
          if (state.status === 'running') return state;
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

        if (remaining <= 0) {
          // Phase complete - transition
          const { phase, currentSession, config, history, totalCompleted } = state;
          const isWork = phase === 'work';

          // Record work sessions in history
          const newHistory = isWork
            ? [
                ...history,
                {
                  id: generateId(),
                  phase: phase,
                  startedAt: state.endTime - getPhaseDuration(phase, config) * 1000,
                  completedAt: Date.now(),
                  durationSeconds: getPhaseDuration(phase, config),
                } as PomodoroSession,
              ]
            : history;

          const newTotalCompleted = isWork ? totalCompleted + 1 : totalCompleted;
          const newCurrentSession = isWork ? currentSession : currentSession;

          const { nextPhase, nextSession } = getNextPhase(
            phase,
            isWork ? currentSession : currentSession,
            config.sessionsBeforeLong
          );
          const nextDuration = getPhaseDuration(nextPhase, config);

          const shouldAutoStart =
            (nextPhase !== 'work' && config.autoStartBreaks) ||
            (nextPhase === 'work' && config.autoStartWork);

          set({
            phase: nextPhase,
            currentSession: nextSession,
            totalCompleted: newTotalCompleted,
            remainingTime: nextDuration,
            endTime: shouldAutoStart ? Date.now() + nextDuration * 1000 : null,
            status: shouldAutoStart ? ('running' as const) : ('idle' as const),
            history: newHistory,
          });
        } else {
          set({ remainingTime: remaining });
        }
      },

      skipPhase: () =>
        set((state) => {
          const { phase, currentSession, config, history, totalCompleted } = state;
          const isWork = phase === 'work';

          // Record work sessions in history when skipping
          const newHistory = isWork
            ? [
                ...history,
                {
                  id: generateId(),
                  phase: phase,
                  startedAt: Date.now() - (getPhaseDuration(phase, config) - state.remainingTime) * 1000,
                  completedAt: Date.now(),
                  durationSeconds: getPhaseDuration(phase, config) - state.remainingTime,
                } as PomodoroSession,
              ]
            : history;

          const newTotalCompleted = isWork ? totalCompleted + 1 : totalCompleted;

          const { nextPhase, nextSession } = getNextPhase(
            phase,
            isWork ? currentSession : currentSession,
            config.sessionsBeforeLong
          );
          const nextDuration = getPhaseDuration(nextPhase, config);

          return {
            phase: nextPhase,
            currentSession: nextSession,
            totalCompleted: newTotalCompleted,
            remainingTime: nextDuration,
            endTime: null,
            status: 'idle' as const,
            history: newHistory,
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
