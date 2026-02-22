import { describe, it, expect } from 'vitest';
import { encodeTimerUrl, decodeTimerUrl, encodeEventUrl, decodeEventUrl } from '../shareUrl';

describe('encodeTimerUrl', () => {
  it('encodes label and duration', () => {
    const url = encodeTimerUrl('Laundry', 1800);
    expect(url).toContain('/t?');
    expect(url).toContain('l=Laundry');
    expect(url).toContain('d=1800');
  });
  it('handles special characters in label', () => {
    const url = encodeTimerUrl('My Timer & Stuff', 60);
    expect(url).toContain('l=My+Timer');
  });
});

describe('decodeTimerUrl', () => {
  it('parses label and duration', () => {
    const result = decodeTimerUrl('?l=Laundry&d=1800');
    expect(result).toEqual({ label: 'Laundry', durationSeconds: 1800 });
  });
  it('returns null for missing params', () => {
    expect(decodeTimerUrl('?l=Laundry')).toBeNull();
  });
  it('returns null for invalid duration', () => {
    expect(decodeTimerUrl('?l=Test&d=-1')).toBeNull();
    expect(decodeTimerUrl('?l=Test&d=abc')).toBeNull();
  });
});

describe('encodeEventUrl', () => {
  it('encodes name and targetDate', () => {
    const url = encodeEventUrl('Birthday', 1700000000000);
    expect(url).toContain('/e?');
    expect(url).toContain('n=Birthday');
    expect(url).toContain('t=1700000000000');
  });
});

describe('decodeEventUrl', () => {
  it('parses name and targetDate', () => {
    const result = decodeEventUrl('?n=Birthday&t=1700000000000');
    expect(result).toEqual({ name: 'Birthday', targetDate: 1700000000000 });
  });
  it('returns null for missing params', () => {
    expect(decodeEventUrl('?n=Birthday')).toBeNull();
  });
});
