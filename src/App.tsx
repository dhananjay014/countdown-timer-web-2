import { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSettingsStore } from './stores/settingsStore';
import { useTimerTick } from './hooks/useTimerTick';
import { lightTheme, darkTheme } from './theme';
import { AppLayout } from './components/layout/AppLayout';
import { TimerList } from './components/timers/TimerList';
import { EventList } from './components/events/EventList';
import { SettingsDialog } from './components/settings/SettingsDialog';
import { AlarmOverlay } from './components/common/AlarmOverlay';

export default function App() {
  const [tab, setTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const themePreference = useSettingsStore((s) => s.theme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  useTimerTick();

  const theme = useMemo(() => {
    if (themePreference === 'dark') return darkTheme;
    if (themePreference === 'light') return lightTheme;
    return prefersDark ? darkTheme : lightTheme;
  }, [themePreference, prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout tab={tab} onTabChange={setTab} onOpenSettings={() => setSettingsOpen(true)}>
        {tab === 0 ? <TimerList /> : <EventList />}
      </AppLayout>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AlarmOverlay />
    </ThemeProvider>
  );
}
