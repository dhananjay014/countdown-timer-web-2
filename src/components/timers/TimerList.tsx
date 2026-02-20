import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useTimersStore } from '../../stores/timersStore';
import type { Timer } from '../../types';
import { TimerCard } from './TimerCard';
import { TimerForm } from './TimerForm';
import { TimerPresets } from './TimerPresets';
import { EmptyState } from '../common/EmptyState';

export function TimerList() {
  const timers = useTimersStore((s) => s.timers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);

  const handleEdit = useCallback((timer: Timer) => {
    setEditingTimer(timer);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingTimer(null);
  }, []);

  return (
    <Box>
      <TimerPresets />
      {timers.length === 0 ? (
        <EmptyState message="No timers yet" subtitle="Tap + to create your first timer, or use Quick Start above" />
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } }}>
          {timers.map((timer) => (
            <TimerCard key={timer.id} timer={timer} onEdit={handleEdit} />
          ))}
        </Box>
      )}
      <Fab
        color="primary"
        onClick={() => setFormOpen(true)}
        sx={{
          position: 'fixed', bottom: 24, right: 24,
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        <AddIcon />
      </Fab>
      <TimerForm open={formOpen} timer={editingTimer} onClose={handleClose} />
    </Box>
  );
}
