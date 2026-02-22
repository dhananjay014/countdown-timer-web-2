import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ReplayIcon from '@mui/icons-material/Replay';
import { usePomodoroStore, getPhaseDuration } from '../../stores/pomodoroStore';
import { ProgressRing } from '../timers/ProgressRing';
import type { PomodoroPhase } from '../../types/pomodoro';

function formatPomodoroTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getPhaseLabel(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work':
      return 'WORK';
    case 'shortBreak':
      return 'SHORT BREAK';
    case 'longBreak':
      return 'LONG BREAK';
  }
}

function getPhaseColor(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work':
      return 'primary.main';
    case 'shortBreak':
      return 'success.main';
    case 'longBreak':
      return 'info.main';
  }
}

const controlButtonSx = { bgcolor: 'action.hover', width: 56, height: 56 } as const;

export const PomodoroDisplay = memo(function PomodoroDisplay() {
  const status = usePomodoroStore((s) => s.status);
  const phase = usePomodoroStore((s) => s.phase);
  const currentSession = usePomodoroStore((s) => s.currentSession);
  const remainingTime = usePomodoroStore((s) => s.remainingTime);
  const config = usePomodoroStore((s) => s.config);
  const start = usePomodoroStore((s) => s.start);
  const pause = usePomodoroStore((s) => s.pause);
  const reset = usePomodoroStore((s) => s.reset);
  const skipPhase = usePomodoroStore((s) => s.skipPhase);

  const totalSeconds = getPhaseDuration(phase, config);
  const progress = totalSeconds > 0 ? (totalSeconds - remainingTime) / totalSeconds : 0;
  const isRunning = status === 'running';

  return (
    <Card sx={{ width: '100%', maxWidth: 480, textAlign: 'center', mx: 'auto' }}>
      <CardContent sx={{ py: 4 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: getPhaseColor(phase), mb: 2, letterSpacing: 2 }}
        >
          {getPhaseLabel(phase)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ProgressRing progress={progress} size={220} strokeWidth={8}>
            <Typography
              variant="h2"
              fontFamily="monospace"
              fontWeight={700}
              sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' }, letterSpacing: 2 }}
            >
              {formatPomodoroTime(remainingTime)}
            </Typography>
          </ProgressRing>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          {Array.from({ length: config.sessionsBeforeLong }, (_, i) => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: i < currentSession - 1 || (i === currentSession - 1 && phase !== 'work')
                  ? 'primary.main'
                  : 'transparent',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center">
          {isRunning ? (
            <IconButton
              color="primary"
              onClick={pause}
              sx={controlButtonSx}
              aria-label="pause"
            >
              <PauseIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              onClick={start}
              sx={controlButtonSx}
              aria-label="start"
            >
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          )}

          <IconButton
            onClick={skipPhase}
            sx={controlButtonSx}
            aria-label="skip"
          >
            <SkipNextIcon fontSize="large" />
          </IconButton>

          <IconButton
            onClick={reset}
            sx={controlButtonSx}
            aria-label="reset"
          >
            <ReplayIcon fontSize="large" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
});
