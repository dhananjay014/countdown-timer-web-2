import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage on window before store module loads
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  get length() { return Object.keys(store).length; },
  key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Dynamic import to ensure localStorage mock is in place first
const { useWorldClockStore } = await import('../worldClockStore');

describe('worldClockStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useWorldClockStore.setState({ clocks: [] });
  });

  it('default state has empty clocks array', () => {
    const { clocks } = useWorldClockStore.getState();
    expect(clocks).toEqual([]);
  });

  it('addClock adds a clock with id, timezone, label', () => {
    const { addClock } = useWorldClockStore.getState();
    addClock('America/New_York', 'New York');

    const { clocks } = useWorldClockStore.getState();
    expect(clocks).toHaveLength(1);
    expect(clocks[0]).toMatchObject({
      timezone: 'America/New_York',
      label: 'New York',
    });
    expect(clocks[0].id).toBeDefined();
    expect(typeof clocks[0].id).toBe('string');
  });

  it('removeClock removes by id', () => {
    const { addClock } = useWorldClockStore.getState();
    addClock('America/New_York', 'New York');
    addClock('Europe/London', 'London');

    const { clocks, removeClock } = useWorldClockStore.getState();
    expect(clocks).toHaveLength(2);

    removeClock(clocks[0].id);

    const updated = useWorldClockStore.getState().clocks;
    expect(updated).toHaveLength(1);
    expect(updated[0].timezone).toBe('Europe/London');
  });

  it('reorderClocks swaps positions', () => {
    const { addClock } = useWorldClockStore.getState();
    addClock('America/New_York', 'New York');
    addClock('Europe/London', 'London');
    addClock('Asia/Tokyo', 'Tokyo');

    const { reorderClocks } = useWorldClockStore.getState();
    reorderClocks(0, 2);

    const { clocks } = useWorldClockStore.getState();
    expect(clocks[0].timezone).toBe('Europe/London');
    expect(clocks[1].timezone).toBe('Asia/Tokyo');
    expect(clocks[2].timezone).toBe('America/New_York');
  });

  it('prevents duplicate timezones', () => {
    const { addClock } = useWorldClockStore.getState();
    addClock('America/New_York', 'New York');
    addClock('America/New_York', 'New York Again');

    const { clocks } = useWorldClockStore.getState();
    expect(clocks).toHaveLength(1);
  });

  it('max 10 clocks enforced', () => {
    const { addClock } = useWorldClockStore.getState();
    const timezones = [
      'America/New_York', 'Europe/London', 'Asia/Tokyo',
      'America/Chicago', 'Europe/Paris', 'Asia/Seoul',
      'America/Denver', 'Europe/Berlin', 'Asia/Shanghai',
      'America/Los_Angeles', 'Australia/Sydney',
    ];

    for (const tz of timezones) {
      addClock(tz, tz);
    }

    const { clocks } = useWorldClockStore.getState();
    expect(clocks).toHaveLength(10);
  });
});
