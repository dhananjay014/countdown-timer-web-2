import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { usePomodoroStore } from '../pomodoroStore';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

const DEFAULT_WORK_SECONDS = 25 * 60;
const DEFAULT_SHORT_BREAK_SECONDS = 5 * 60;
const DEFAULT_LONG_BREAK_SECONDS = 15 * 60;

function getState() {
  return usePomodoroStore.getState();
}

describe('pomodoroStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
    localStorageMock.clear();
    // Reset config to defaults, then reset state
    getState().setConfig({
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      sessionsBeforeLong: 4,
      autoStartBreaks: false,
      autoStartWork: false,
    });
    getState().reset();
    // Clear history separately since reset doesn't clear it
    usePomodoroStore.setState({ history: [], totalCompleted: 0 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('has idle status and work phase', () => {
      const state = getState();
      expect(state.status).toBe('idle');
      expect(state.phase).toBe('work');
      expect(state.currentSession).toBe(1);
      expect(state.totalCompleted).toBe(0);
      expect(state.remainingTime).toBe(DEFAULT_WORK_SECONDS);
      expect(state.endTime).toBeNull();
      expect(state.history).toEqual([]);
    });

    it('has default config values', () => {
      const { config } = getState();
      expect(config.workMinutes).toBe(25);
      expect(config.shortBreakMinutes).toBe(5);
      expect(config.longBreakMinutes).toBe(15);
      expect(config.sessionsBeforeLong).toBe(4);
      expect(config.autoStartBreaks).toBe(false);
      expect(config.autoStartWork).toBe(false);
    });
  });

  describe('start()', () => {
    it('sets status to running and calculates endTime', () => {
      getState().start();
      const state = getState();
      expect(state.status).toBe('running');
      expect(state.endTime).toBe(Date.now() + DEFAULT_WORK_SECONDS * 1000);
    });

    it('does not start if already running', () => {
      getState().start();
      const endTime1 = getState().endTime;
      vi.advanceTimersByTime(1000);
      getState().start();
      expect(getState().endTime).toBe(endTime1);
    });

    it('can resume from paused state', () => {
      getState().start();
      vi.advanceTimersByTime(5000);
      getState().pause();
      const remaining = getState().remainingTime;

      vi.advanceTimersByTime(2000);
      getState().start();
      const state = getState();
      expect(state.status).toBe('running');
      expect(state.endTime).toBe(Date.now() + remaining * 1000);
    });
  });

  describe('pause()', () => {
    it('preserves remainingTime and clears endTime', () => {
      getState().start();
      vi.advanceTimersByTime(10000); // 10 seconds
      getState().pause();

      const state = getState();
      expect(state.status).toBe('paused');
      expect(state.endTime).toBeNull();
      expect(state.remainingTime).toBe(DEFAULT_WORK_SECONDS - 10);
    });

    it('does nothing if not running', () => {
      getState().pause();
      expect(getState().status).toBe('idle');
    });
  });

  describe('reset()', () => {
    it('returns to idle work phase with full time', () => {
      getState().start();
      vi.advanceTimersByTime(30000);
      getState().reset();

      const state = getState();
      expect(state.status).toBe('idle');
      expect(state.phase).toBe('work');
      expect(state.currentSession).toBe(1);
      expect(state.remainingTime).toBe(DEFAULT_WORK_SECONDS);
      expect(state.endTime).toBeNull();
    });
  });

  describe('tick()', () => {
    it('decrements remainingTime based on endTime', () => {
      getState().start();
      vi.advanceTimersByTime(5000);
      getState().tick();

      expect(getState().remainingTime).toBe(DEFAULT_WORK_SECONDS - 5);
    });

    it('transitions phase when time reaches 0', () => {
      getState().start();
      vi.advanceTimersByTime(DEFAULT_WORK_SECONDS * 1000 + 100);
      getState().tick();

      const state = getState();
      expect(state.phase).toBe('shortBreak');
      expect(state.remainingTime).toBe(DEFAULT_SHORT_BREAK_SECONDS);
    });

    it('does nothing when not running', () => {
      const before = getState().remainingTime;
      getState().tick();
      expect(getState().remainingTime).toBe(before);
    });
  });

  describe('phase transitions', () => {
    function completePhase() {
      getState().start();
      const remaining = getState().remainingTime;
      vi.advanceTimersByTime(remaining * 1000 + 100);
      getState().tick();
    }

    it('transitions work -> shortBreak', () => {
      completePhase(); // complete work
      expect(getState().phase).toBe('shortBreak');
    });

    it('transitions shortBreak -> work', () => {
      completePhase(); // complete work -> shortBreak
      completePhase(); // complete shortBreak -> work
      expect(getState().phase).toBe('work');
    });

    it('transitions to longBreak after N work sessions', () => {
      const sessions = getState().config.sessionsBeforeLong; // 4

      for (let i = 0; i < sessions; i++) {
        completePhase(); // complete work
        if (i < sessions - 1) {
          completePhase(); // complete shortBreak
        }
      }

      // After 4th work session, should be longBreak
      expect(getState().phase).toBe('longBreak');
      expect(getState().remainingTime).toBe(DEFAULT_LONG_BREAK_SECONDS);
    });

    it('resets currentSession after longBreak', () => {
      const sessions = getState().config.sessionsBeforeLong; // 4

      for (let i = 0; i < sessions; i++) {
        completePhase(); // complete work
        if (i < sessions - 1) {
          completePhase(); // complete shortBreak
        }
      }

      // Now in longBreak
      expect(getState().phase).toBe('longBreak');
      completePhase(); // complete longBreak

      expect(getState().phase).toBe('work');
      expect(getState().currentSession).toBe(1);
    });

    it('auto-starts breaks when autoStartBreaks is enabled', () => {
      getState().setConfig({ autoStartBreaks: true });
      completePhase(); // complete work -> shortBreak

      expect(getState().phase).toBe('shortBreak');
      expect(getState().status).toBe('running');
      expect(getState().endTime).not.toBeNull();
    });

    it('auto-starts work when autoStartWork is enabled', () => {
      getState().setConfig({ autoStartWork: true });
      completePhase(); // complete work -> shortBreak
      completePhase(); // complete shortBreak -> work

      expect(getState().phase).toBe('work');
      expect(getState().status).toBe('running');
      expect(getState().endTime).not.toBeNull();
    });

    it('does not auto-start when disabled', () => {
      completePhase(); // complete work -> shortBreak
      expect(getState().status).toBe('idle');
    });
  });

  describe('history', () => {
    function completePhase() {
      getState().start();
      const remaining = getState().remainingTime;
      vi.advanceTimersByTime(remaining * 1000 + 100);
      getState().tick();
    }

    it('records completed work sessions', () => {
      completePhase(); // complete work

      const { history } = getState();
      expect(history).toHaveLength(1);
      expect(history[0].phase).toBe('work');
      expect(history[0].durationSeconds).toBe(DEFAULT_WORK_SECONDS);
    });

    it('does not record break sessions', () => {
      completePhase(); // complete work -> shortBreak
      completePhase(); // complete shortBreak -> work

      const { history } = getState();
      expect(history).toHaveLength(1); // only work session
    });

    it('increments totalCompleted on work completion', () => {
      completePhase(); // complete work
      expect(getState().totalCompleted).toBe(1);

      completePhase(); // complete shortBreak
      completePhase(); // complete work
      expect(getState().totalCompleted).toBe(2);
    });
  });

  describe('skipPhase()', () => {
    it('transitions to next phase immediately', () => {
      getState().start();
      getState().skipPhase();

      expect(getState().phase).toBe('shortBreak');
      expect(getState().status).toBe('idle');
      expect(getState().remainingTime).toBe(DEFAULT_SHORT_BREAK_SECONDS);
    });

    it('skips from shortBreak to work', () => {
      getState().skipPhase(); // work -> shortBreak
      getState().skipPhase(); // shortBreak -> work

      expect(getState().phase).toBe('work');
    });

    it('records work session in history when skipping work phase', () => {
      getState().start();
      vi.advanceTimersByTime(5000);
      getState().tick(); // update remainingTime so elapsed > 0
      getState().skipPhase();

      const { history } = getState();
      expect(history).toHaveLength(1);
      expect(history[0].phase).toBe('work');
    });
  });

  describe('setConfig()', () => {
    it('updates config values', () => {
      getState().setConfig({ workMinutes: 30, shortBreakMinutes: 10 });
      const { config } = getState();
      expect(config.workMinutes).toBe(30);
      expect(config.shortBreakMinutes).toBe(10);
      expect(config.longBreakMinutes).toBe(15); // unchanged
    });

    it('resets remainingTime when idle and work phase changes', () => {
      getState().setConfig({ workMinutes: 30 });
      expect(getState().remainingTime).toBe(30 * 60);
    });

    it('does not reset remainingTime when running', () => {
      getState().start();
      getState().setConfig({ workMinutes: 30 });
      // remainingTime should still be based on original config
      expect(getState().config.workMinutes).toBe(30);
    });
  });

  describe('clearHistory()', () => {
    function completePhase() {
      getState().start();
      const remaining = getState().remainingTime;
      vi.advanceTimersByTime(remaining * 1000 + 100);
      getState().tick();
    }

    it('clears all history entries', () => {
      completePhase();
      expect(getState().history).toHaveLength(1);

      getState().clearHistory();
      expect(getState().history).toEqual([]);
    });
  });
});
