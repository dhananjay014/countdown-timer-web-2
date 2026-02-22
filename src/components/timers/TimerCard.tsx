import { memo, useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { Timer } from '../../types';
import { useTimersStore } from '../../stores/timersStore';
import { formatTime } from '../../utils/timeCalculations';
import { ProgressRing } from './ProgressRing';

interface TimerCardProps {
  timer: Timer;
  onEdit: (timer: Timer) => void;
}

export const TimerCard = memo(function TimerCard({ timer, onEdit }: TimerCardProps) {
  const startTimer = useTimersStore((s) => s.startTimer);
  const pauseTimer = useTimersStore((s) => s.pauseTimer);
  const resetTimer = useTimersStore((s) => s.resetTimer);
  const deleteTimer = useTimersStore((s) => s.deleteTimer);
  const duplicateTimer = useTimersStore((s) => s.duplicateTimer);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const progress = timer.totalSeconds > 0 ? timer.remainingTime / timer.totalSeconds : 0;
  const isCompleted = timer.status === 'completed';
  const isRunning = timer.status === 'running';
  const isIdle = timer.status === 'idle';

  const handleDelete = useCallback(() => {
    deleteTimer(timer.id);
    setConfirmOpen(false);
  }, [deleteTimer, timer.id]);

  return (
    <>
      <Card sx={{
        textAlign: 'center',
        p: 1,
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
        '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
        ...(isCompleted && {
          borderColor: 'error.main',
          borderWidth: 2,
          borderStyle: 'solid',
          animation: 'completedGlow 2s ease-in-out infinite alternate',
          '@keyframes completedGlow': {
            '0%': { boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)' },
            '100%': { boxShadow: '0 0 20px rgba(244, 67, 54, 0.6)' },
          },
        }),
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1 }}>
              {timer.label || 'Timer'}
            </Typography>
            <IconButton size="small" onClick={() => onEdit(timer)} disabled={!isIdle}><EditIcon fontSize="small" /></IconButton>
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
            <IconButton onClick={() => duplicateTimer(timer.id)} aria-label="duplicate timer"><ContentCopyIcon /></IconButton>
            <IconButton color="error" onClick={() => setConfirmOpen(true)}><DeleteIcon /></IconButton>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Timer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{timer.label || 'Timer'}"? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
