import { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSettingsStore } from './stores/settingsStore';
import { useTimerTick } from './hooks/useTimerTick';
import { useNotification } from './hooks/useNotification';
import { lightTheme, darkTheme } from './theme';
import { HomePage } from './pages/HomePage';
import { AlarmOverlay } from './components/common/AlarmOverlay';
import { ShareTimerRoute } from './components/share/ShareTimerRoute';
import { ShareEventRoute } from './components/share/ShareEventRoute';

export default function App() {
  const themePreference = useSettingsStore((s) => s.theme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  useTimerTick();
  useNotification();

  const theme = useMemo(() => {
    if (themePreference === 'dark') return darkTheme;
    if (themePreference === 'light') return lightTheme;
    return prefersDark ? darkTheme : lightTheme;
  }, [themePreference, prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/t" element={<ShareTimerRoute />} />
        <Route path="/e" element={<ShareEventRoute />} />
        {/* Embed route placeholder — Feature 4 will replace this */}
        <Route path="/embed/*" element={<div>Embed placeholder</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AlarmOverlay />
    </ThemeProvider>
  );
}
