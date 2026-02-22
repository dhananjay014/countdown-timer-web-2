import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useEmbedTimerStore } from '../embedTimerStore';

function getState() {
  return useEmbedTimerStore.getState();
}

describe('embedTimerStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
    // Reset store to default state
    useEmbedTimerStore.setState({
      label: '',
      totalSeconds: 0,
      remainingTime: 0,
      endTime: null,
      status: 'idle',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('init()', () => {
    it('sets label, totalSeconds, remainingTime, and status to idle', () => {
      getState().init('Test Timer', 120);

      const state = getState();
      expect(state.label).toBe('Test Timer');
      expect(state.totalSeconds).toBe(120);
      expect(state.remainingTime).toBe(120);
      expect(state.status).toBe('idle');
      expect(state.endTime).toBeNull();
    });
  });

  describe('start()', () => {
    it('sets status to running and calculates endTime', () => {
      getState().init('Timer', 60);
      getState().start();

      const state = getState();
      expect(state.status).toBe('running');
      expect(state.endTime).toBe(Date.now() + 60 * 1000);
    });
  });

  describe('pause()', () => {
    it('captures remaining time and sets status to paused', () => {
      getState().init('Timer', 60);
      getState().start();
      vi.advanceTimersByTime(10000); // 10 seconds
      getState().pause();

      const state = getState();
      expect(state.status).toBe('paused');
      expect(state.remainingTime).toBe(50);
      expect(state.endTime).toBeNull();
    });

    it('does nothing if endTime is null', () => {
      getState().init('Timer', 60);
      getState().pause();

      expect(getState().status).toBe('idle');
      expect(getState().remainingTime).toBe(60);
    });
  });

  describe('reset()', () => {
    it('restores to initial totalSeconds and sets status to idle', () => {
      getState().init('Timer', 120);
      getState().start();
      vi.advanceTimersByTime(30000);
      getState().reset();

      const state = getState();
      expect(state.status).toBe('idle');
      expect(state.remainingTime).toBe(120);
      expect(state.endTime).toBeNull();
    });
  });

  describe('tick()', () => {
    it('decrements remaining from endTime', () => {
      getState().init('Timer', 60);
      getState().start();
      vi.advanceTimersByTime(5000); // 5 seconds
      getState().tick();

      expect(getState().remainingTime).toBe(55);
    });

    it('sets completed when remaining reaches 0', () => {
      getState().init('Timer', 10);
      getState().start();
      vi.advanceTimersByTime(10000 + 100); // past the end
      getState().tick();

      const state = getState();
      expect(state.remainingTime).toBe(0);
      expect(state.status).toBe('completed');
      expect(state.endTime).toBeNull();
    });

    it('does nothing when not running', () => {
      getState().init('Timer', 60);
      const before = getState().remainingTime;
      getState().tick();

      expect(getState().remainingTime).toBe(before);
    });

    it('does nothing when endTime is null', () => {
      getState().init('Timer', 60);
      useEmbedTimerStore.setState({ status: 'running', endTime: null });
      getState().tick();

      expect(getState().remainingTime).toBe(60);
    });
  });
});
