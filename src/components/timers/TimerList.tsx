import { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useTimersStore } from '../../stores/timersStore';
import type { Timer } from '../../types';
import { TimerCard } from './TimerCard';
import { TimerForm } from './TimerForm';
import { EmptyState } from '../common/EmptyState';

export function TimerList() {
  const timers = useTimersStore((s) => s.timers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);

  const handleEdit = (timer: Timer) => {
    setEditingTimer(timer);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingTimer(null);
  };

  return (
    <Box>
      {timers.length === 0 ? (
        <EmptyState message="No timers yet" subtitle="Tap + to create your first timer" />
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } }}>
          {timers.map((timer) => (
            <TimerCard key={timer.id} timer={timer} onEdit={handleEdit} />
          ))}
        </Box>
      )}
      <Fab color="primary" onClick={() => setFormOpen(true)} sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
      <TimerForm open={formOpen} timer={editingTimer} onClose={handleClose} />
    </Box>
  );
}
