import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { lightTheme, darkTheme } from '../../theme';
import { useEmbedTimerStore } from '../../stores/embedTimerStore';
import { EmbedMinimal } from './EmbedMinimal';
import { EmbedFull } from './EmbedFull';

interface EmbedParams {
  label: string;
  duration: number;
  mode: 'minimal' | 'full';
  theme: 'light' | 'dark';
}

function parseEmbedParams(search: string): EmbedParams | null {
  const params = new URLSearchParams(search);
  const label = params.get('l');
  const durationStr = params.get('d');

  if (!label || !durationStr) return null;

  const duration = Number(durationStr);
  if (isNaN(duration) || duration <= 0) return null;

  const modeParam = params.get('mode');
  const mode: 'minimal' | 'full' = modeParam === 'full' ? 'full' : 'minimal';

  const themeParam = params.get('theme');
  const theme: 'light' | 'dark' = themeParam === 'dark' ? 'dark' : 'light';

  return { label, duration, mode, theme };
}

export function EmbedTimerPage() {
  const { search } = useLocation();
  const embedParams = useMemo(() => parseEmbedParams(search), [search]);

  const status = useEmbedTimerStore((s) => s.status);
  const totalSeconds = useEmbedTimerStore((s) => s.totalSeconds);
  const init = useEmbedTimerStore((s) => s.init);
  const start = useEmbedTimerStore((s) => s.start);
  const tick = useEmbedTimerStore((s) => s.tick);

  const initialized = useRef(false);

  // Initialize store from URL params on mount (once only)
  useEffect(() => {
    if (embedParams && !initialized.current) {
      initialized.current = true;
      init(embedParams.label, embedParams.duration);
    }
  }, [embedParams, init]);

  // Auto-start for minimal mode after init
  useEffect(() => {
    if (embedParams?.mode === 'minimal' && status === 'idle' && totalSeconds > 0) {
      start();
    }
  }, [embedParams?.mode, status, totalSeconds, start]);

  // Tick interval when running
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [status, tick]);

  if (!embedParams) {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Typography color="error">
            Invalid embed parameters. Required: l (label) and d (duration in seconds).
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const theme = embedParams.theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {embedParams.mode === 'full' ? <EmbedFull /> : <EmbedMinimal />}
    </ThemeProvider>
  );
}
