const MAX_LABEL_LENGTH = 200;
const MAX_TIMER_DURATION = 86400; // 24 hours in seconds

export function encodeTimerUrl(label: string, durationSeconds: number): string {
  const params = new URLSearchParams({ l: label, d: String(durationSeconds) });
  return `${window.location.origin}/t?${params}`;
}

export function decodeTimerUrl(search: string): { label: string; durationSeconds: number } | null {
  const params = new URLSearchParams(search);
  const l = params.get('l');
  const d = params.get('d');
  if (!l || !d || isNaN(Number(d)) || Number(d) <= 0) return null;
  if (l.length > MAX_LABEL_LENGTH) return null;
  const durationSeconds = Number(d);
  if (durationSeconds > MAX_TIMER_DURATION) return null;
  return { label: l.trim(), durationSeconds };
}

export function encodeEventUrl(name: string, targetDate: number): string {
  const params = new URLSearchParams({ n: name, t: String(targetDate) });
  return `${window.location.origin}/e?${params}`;
}

export function decodeEventUrl(search: string): { name: string; targetDate: number } | null {
  const params = new URLSearchParams(search);
  const n = params.get('n');
  const t = params.get('t');
  if (!n || !t || isNaN(Number(t))) return null;
  if (n.length > MAX_LABEL_LENGTH) return null;
  const targetDate = Number(t);
  if (targetDate < 0 || targetDate > 32503680000000) return null;
  return { name: n.trim(), targetDate };
}
