import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Timer } from '../../types';
import { useTimersStore } from '../../stores/timersStore';
import { formatTime } from '../../utils/timeCalculations';
import { ProgressRing } from './ProgressRing';

interface TimerCardProps {
  timer: Timer;
  onEdit: (timer: Timer) => void;
}

export function TimerCard({ timer, onEdit }: TimerCardProps) {
  const { startTimer, pauseTimer, resetTimer, deleteTimer } = useTimersStore();
  const progress = timer.totalSeconds > 0 ? timer.remainingTime / timer.totalSeconds : 0;
  const isCompleted = timer.status === 'completed';
  const isRunning = timer.status === 'running';

  return (
    <Card sx={{ textAlign: 'center', p: 1, ...(isCompleted && { borderColor: 'error.main', borderWidth: 2, borderStyle: 'solid' }) }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1 }}>
            {timer.label || 'Timer'}
          </Typography>
          <IconButton size="small" onClick={() => onEdit(timer)}><EditIcon fontSize="small" /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ProgressRing progress={progress}>
            <Typography variant="h5" fontFamily="monospace" fontWeight={700}>
              {formatTime(timer.remainingTime)}
            </Typography>
          </ProgressRing>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="center">
          {isRunning ? (
            <IconButton color="primary" onClick={() => pauseTimer(timer.id)}><PauseIcon /></IconButton>
          ) : (
            <IconButton color="primary" onClick={() => startTimer(timer.id)} disabled={isCompleted && timer.remainingTime <= 0}>
              <PlayArrowIcon />
            </IconButton>
          )}
          <IconButton onClick={() => resetTimer(timer.id)}><ReplayIcon /></IconButton>
          <IconButton color="error" onClick={() => deleteTimer(timer.id)}><DeleteIcon /></IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
