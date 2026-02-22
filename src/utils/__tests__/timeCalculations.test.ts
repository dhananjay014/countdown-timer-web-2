import { describe, it, expect } from 'vitest';
import { formatTime, generateId } from '../timeCalculations';

describe('formatTime', () => {
  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('00:00:00');
  });

  it('formats hours minutes seconds', () => {
    expect(formatTime(3661)).toBe('01:01:01');
  });

  it('formats just seconds', () => {
    expect(formatTime(45)).toBe('00:00:45');
  });

  it('formats just minutes', () => {
    expect(formatTime(300)).toBe('00:05:00');
  });

  it('formats large values', () => {
    expect(formatTime(86399)).toBe('23:59:59');
  });
});

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique values', () => {
    expect(generateId()).not.toBe(generateId());
  });
});
