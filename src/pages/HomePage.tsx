import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppLayout } from '../components/layout/AppLayout';
import { TimerList } from '../components/timers/TimerList';
import { EventList } from '../components/events/EventList';
import { Stopwatch } from '../components/stopwatch/Stopwatch';
import { WorldClockPage } from '../components/worldclock/WorldClockPage';

export function HomePage() {
  const [tab, setTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppLayout tab={tab} onTabChange={setTab} onOpenSettings={() => setSettingsOpen(true)} settingsOpen={settingsOpen} onCloseSettings={() => setSettingsOpen(false)}>
      {tab === 0 && <TimerList />}
      {tab === 1 && <EventList />}
      {/* Pomodoro placeholder — Feature 1 will replace this */}
      {tab === 2 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">Pomodoro — Coming Soon</Typography>
        </Box>
      )}
      {tab === 3 && <WorldClockPage />}
      {tab === 4 && <Stopwatch />}
    </AppLayout>
  );
}
