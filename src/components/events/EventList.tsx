import { useState, useMemo, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useEventsStore } from '../../stores/eventsStore';
import type { CountdownEvent } from '../../types';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import { EmptyState } from '../common/EmptyState';
import { useEventTick } from '../../hooks/useEventTick';

export function EventList() {
  const events = useEventsStore((s) => s.events);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);

  // Re-sort when tick changes (events may cross the "past" threshold)
  const tick = useEventTick();

  const handleEdit = useCallback((event: CountdownEvent) => {
    setEditingEvent(event);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingEvent(null);
  }, []);

  const sortedEvents = useMemo(() => {
    const now = Date.now();
    return [...events].sort((a, b) => {
      const aIsPast = a.targetDate <= now;
      const bIsPast = b.targetDate <= now;
      if (aIsPast !== bIsPast) return aIsPast ? 1 : -1;
      return a.targetDate - b.targetDate;
    });
    // tick dependency ensures re-sort when events may cross past threshold
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, tick]);

  return (
    <Box>
      {sortedEvents.length === 0 ? (
        <EmptyState message="No events yet" subtitle="Tap + to track your first event" />
      ) : (
        <Stack spacing={2}>
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onEdit={handleEdit} />
          ))}
        </Stack>
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
      <EventForm open={formOpen} event={editingEvent} onClose={handleClose} />
    </Box>
  );
}
