import { describe, it, expect } from 'vitest';
import { formatTimeInZone, formatDateInZone, getUtcOffset } from '../timezoneFormat';

describe('formatTimeInZone', () => {
  it('returns a string matching HH:MM:SS AM/PM pattern', () => {
    const result = formatTimeInZone('America/New_York');
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}\s[AP]M$/);
  });

  it('works with different timezones', () => {
    const result = formatTimeInZone('Asia/Tokyo');
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}\s[AP]M$/);
  });
});

describe('formatDateInZone', () => {
  it('returns a string matching date pattern', () => {
    const result = formatDateInZone('Europe/London');
    // e.g. "Sun, Feb 22" or "Sat, Feb 22"
    expect(result).toMatch(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}$/);
  });
});

describe('getUtcOffset', () => {
  it('returns a string starting with GMT', () => {
    const result = getUtcOffset('America/New_York');
    expect(result).toMatch(/^GMT/);
  });

  it('returns GMT offset for UTC timezone', () => {
    const result = getUtcOffset('UTC');
    expect(result).toMatch(/^GMT/);
  });

  it('returns offset for positive timezone', () => {
    const result = getUtcOffset('Asia/Tokyo');
    expect(result).toMatch(/^GMT\+/);
  });
});
