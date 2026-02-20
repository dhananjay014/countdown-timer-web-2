import { create } from 'zustand';
import type { StopwatchStatus, Lap } from '../types';

interface StopwatchState {
  status: StopwatchStatus;
  startTime: number | null; // Date.now() when started
  elapsed: number; // accumulated ms before current run
  laps: Lap[];
  lapStartTime: number; // elapsed time at start of current lap

  start: () => void;
  pause: () => void;
  reset: () => void;
  lap: () => void;
  getElapsed: () => number;
}

export const useStopwatchStore = create<StopwatchState>()((set, get) => ({
  status: 'idle',
  startTime: null,
  elapsed: 0,
  laps: [],
  lapStartTime: 0,

  start: () =>
    set((state) => {
      if (state.status === 'running') return state;
      return {
        status: 'running' as const,
        startTime: Date.now(),
      };
    }),

  pause: () =>
    set((state) => {
      if (state.status !== 'running' || !state.startTime) return state;
      const now = Date.now();
      return {
        status: 'paused' as const,
        elapsed: state.elapsed + (now - state.startTime),
        startTime: null,
      };
    }),

  reset: () =>
    set(() => ({
      status: 'idle' as const,
      startTime: null,
      elapsed: 0,
      laps: [],
      lapStartTime: 0,
    })),

  lap: () =>
    set((state) => {
      if (state.status !== 'running') return state;
      const currentElapsed = get().getElapsed();
      const lapTime = currentElapsed - state.lapStartTime;
      const newLap: Lap = {
        id: state.laps.length + 1,
        time: lapTime,
        total: currentElapsed,
      };
      return {
        laps: [newLap, ...state.laps],
        lapStartTime: currentElapsed,
      };
    }),

  getElapsed: () => {
    const state = get();
    if (state.status === 'running' && state.startTime) {
      return state.elapsed + (Date.now() - state.startTime);
    }
    return state.elapsed;
  },
}));
