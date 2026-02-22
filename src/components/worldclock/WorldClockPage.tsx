import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import PublicIcon from '@mui/icons-material/Public';
import { useWorldClockStore } from '../../stores/worldClockStore';
import { TIMEZONE_OPTIONS } from '../../utils/timezones';
import { WorldClockCard } from './WorldClockCard';
import { AddClockDialog } from './AddClockDialog';

export function WorldClockPage() {
  const clocks = useWorldClockStore((s) => s.clocks);
  const addClock = useWorldClockStore((s) => s.addClock);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-add local timezone on first load
  useEffect(() => {
    if (clocks.length > 0) return;

    // Check if the store has ever been hydrated with data
    const stored = localStorage.getItem('world-clocks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.state?.clocks?.length > 0) return;
      } catch {
        // ignore parse errors
      }
    }

    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = TIMEZONE_OPTIONS.find((o) => o.timezone === localTz);
    const label = match ? match.label : localTz;
    addClock(localTz, label);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {clocks.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, opacity: 0.6 }}>
          <PublicIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6">Add your first clock</Typography>
          <Typography variant="body2" color="text.secondary">
            Track time across different cities around the world
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {clocks.map((clock) => (
            <Grid key={clock.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <WorldClockCard clock={clock} />
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        aria-label="Add clock"
      >
        <AddIcon />
      </Fab>

      <AddClockDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
