import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Timer } from '../types';
import { generateId } from '../utils/timeCalculations';
import { MAX_TIMERS } from '../utils/constants';

interface TimersState {
  timers: Timer[];
  completedTimerIds: string[];
  addTimer: (label: string, hours: number, minutes: number, seconds: number) => void;
  updateTimer: (id: string, label: string, hours: number, minutes: number, seconds: number) => void;
  deleteTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  tickTimers: () => void;
  dismissAlarm: (id: string) => void;
  dismissAllAlarms: () => void;
  resetAndDismissAll: () => void;
}

export const useTimersStore = create<TimersState>()(
  persist(
    (set) => ({
      timers: [],
      completedTimerIds: [],

      addTimer: (label, hours, minutes, seconds) =>
        set((state) => {
          if (state.timers.length >= MAX_TIMERS) return state;
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          if (totalSeconds <= 0) return state;

          const newTimer: Timer = {
            id: generateId(),
            label,
            hours,
            minutes,
            seconds,
            totalSeconds,
            remainingTime: totalSeconds,
            endTime: null,
            status: 'idle',
            createdAt: Date.now(),
          };

          return { timers: [...state.timers, newTimer] };
        }),

      updateTimer: (id, label, hours, minutes, seconds) =>
        set((state) => {
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          if (totalSeconds <= 0) return state;

          return {
            timers: state.timers.map((timer) =>
              timer.id === id && timer.status === 'idle'
                ? { ...timer, label, hours, minutes, seconds, totalSeconds, remainingTime: totalSeconds }
                : timer
            ),
          };
        }),

      deleteTimer: (id) =>
        set((state) => ({
          timers: state.timers.filter((timer) => timer.id !== id),
          completedTimerIds: state.completedTimerIds.filter((timerId) => timerId !== id),
        })),

      startTimer: (id) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id && (timer.status === 'idle' || timer.status === 'paused')
              ? { ...timer, status: 'running' as const, endTime: Date.now() + timer.remainingTime * 1000 }
              : timer
          ),
        })),

      pauseTimer: (id) =>
        set((state) => ({
          timers: state.timers.map((timer) => {
            if (timer.id === id && timer.status === 'running' && timer.endTime) {
              const remaining = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
              return { ...timer, status: 'paused' as const, remainingTime: remaining, endTime: null };
            }
            return timer;
          }),
        })),

      resetTimer: (id) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id
              ? { ...timer, status: 'idle' as const, remainingTime: timer.totalSeconds, endTime: null }
              : timer
          ),
          completedTimerIds: state.completedTimerIds.filter((timerId) => timerId !== id),
        })),

      tickTimers: () =>
        set((state) => {
          const now = Date.now();
          const newCompletedIds: string[] = [];

          const updatedTimers = state.timers.map((timer) => {
            if (timer.status === 'running' && timer.endTime) {
              const remaining = Math.ceil((timer.endTime - now) / 1000);
              if (remaining <= 0) {
                newCompletedIds.push(timer.id);
                return { ...timer, status: 'completed' as const, remainingTime: 0, endTime: null };
              }
              return { ...timer, remainingTime: remaining };
            }
            return timer;
          });

          return {
            timers: updatedTimers,
            completedTimerIds: [...state.completedTimerIds, ...newCompletedIds],
          };
        }),

      dismissAlarm: (id) =>
        set((state) => ({
          completedTimerIds: state.completedTimerIds.filter((timerId) => timerId !== id),
        })),

      dismissAllAlarms: () =>
        set(() => ({ completedTimerIds: [] })),

      resetAndDismissAll: () =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            state.completedTimerIds.includes(timer.id)
              ? { ...timer, status: 'idle' as const, remainingTime: timer.totalSeconds, endTime: null }
              : timer
          ),
          completedTimerIds: [],
        })),
    }),
    {
      name: 'countdown-timers',
      partialize: (state) => ({ timers: state.timers }),
    }
  )
);

// Optimized selectors
export const selectTimers = (s: TimersState) => s.timers;
export const selectCompletedTimerIds = (s: TimersState) => s.completedTimerIds;
export const selectTimerActions = (s: TimersState) => ({
  startTimer: s.startTimer,
  pauseTimer: s.pauseTimer,
  resetTimer: s.resetTimer,
  deleteTimer: s.deleteTimer,
});
