export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroConfig {
  workMinutes: number;       // default 25
  shortBreakMinutes: number; // default 5
  longBreakMinutes: number;  // default 15
  sessionsBeforeLong: number; // default 4
  autoStartBreaks: boolean;  // default false
  autoStartWork: boolean;    // default false
}

export interface PomodoroSession {
  id: string;
  phase: PomodoroPhase;
  startedAt: number;
  completedAt: number;
  durationSeconds: number;
}

export interface PomodoroState {
  status: PomodoroStatus;
  phase: PomodoroPhase;
  currentSession: number;    // 1-based, resets after long break
  totalCompleted: number;    // lifetime work sessions completed
  remainingTime: number;     // seconds
  endTime: number | null;    // absolute timestamp
  config: PomodoroConfig;
  history: PomodoroSession[];
}
