export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Timer {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  remainingTime: number;
  endTime: number | null;
  status: TimerStatus;
  createdAt: number;
}

export interface CountdownEvent {
  id: string;
  name: string;
  targetDate: number;
  createdAt: number;
}

export interface Settings {
  soundEnabled: boolean;
  volume: number;
  theme: 'light' | 'dark' | 'system';
}
