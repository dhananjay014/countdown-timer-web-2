import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TimerList } from '../components/timers/TimerList';
import { EventList } from '../components/events/EventList';
import { Stopwatch } from '../components/stopwatch/Stopwatch';
import { WorldClockPage } from '../components/worldclock/WorldClockPage';
import { PomodoroPage } from '../components/pomodoro/PomodoroPage';

export function HomePage() {
  const [tab, setTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppLayout tab={tab} onTabChange={setTab} onOpenSettings={() => setSettingsOpen(true)} settingsOpen={settingsOpen} onCloseSettings={() => setSettingsOpen(false)}>
      {tab === 0 && <TimerList />}
      {tab === 1 && <EventList />}
      {tab === 2 && <PomodoroPage />}
      {tab === 3 && <WorldClockPage />}
      {tab === 4 && <Stopwatch />}
    </AppLayout>
  );
}
