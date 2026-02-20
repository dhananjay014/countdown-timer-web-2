import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import FlagIcon from '@mui/icons-material/Flag';
import { useStopwatchStore } from '../../stores/stopwatchStore';
import { LapList } from './LapList';

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const parts = [minutes, seconds].map((v) => String(v).padStart(2, '0'));
  const cs = String(centiseconds).padStart(2, '0');

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${parts[0]}:${parts[1]}.${cs}`;
  }
  return `${parts[0]}:${parts[1]}.${cs}`;
}

export function Stopwatch() {
  const status = useStopwatchStore((s) => s.status);
  const laps = useStopwatchStore((s) => s.laps);
  const getElapsed = useStopwatchStore((s) => s.getElapsed);
  const start = useStopwatchStore((s) => s.start);
  const pause = useStopwatchStore((s) => s.pause);
  const reset = useStopwatchStore((s) => s.reset);
  const lap = useStopwatchStore((s) => s.lap);

  const [display, setDisplay] = useState('00:00.00');

  useEffect(() => {
    if (status !== 'running') {
      setDisplay(formatMs(getElapsed()));
      return;
    }

    const id = setInterval(() => {
      setDisplay(formatMs(getElapsed()));
    }, 16); // ~60fps for smooth centisecond display

    return () => clearInterval(id);
  }, [status, getElapsed]);

  const isRunning = status === 'running';
  const isIdle = status === 'idle';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 480, textAlign: 'center', mb: 3 }}>
        <CardContent sx={{ py: 4 }}>
          <Typography
            variant="h2"
            fontFamily="monospace"
            fontWeight={700}
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              letterSpacing: 2,
              mb: 3,
            }}
          >
            {display}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            {isRunning ? (
              <IconButton
                color="primary"
                onClick={pause}
                sx={{ bgcolor: 'action.hover', width: 56, height: 56 }}
              >
                <PauseIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                onClick={start}
                sx={{ bgcolor: 'action.hover', width: 56, height: 56 }}
              >
                <PlayArrowIcon fontSize="large" />
              </IconButton>
            )}

            {isRunning && (
              <IconButton
                onClick={lap}
                sx={{ bgcolor: 'action.hover', width: 56, height: 56 }}
                aria-label="lap"
              >
                <FlagIcon fontSize="large" />
              </IconButton>
            )}

            {!isIdle && !isRunning && (
              <IconButton
                onClick={reset}
                sx={{ bgcolor: 'action.hover', width: 56, height: 56 }}
                aria-label="reset"
              >
                <ReplayIcon fontSize="large" />
              </IconButton>
            )}
          </Stack>

          {laps.length > 0 && (
            <Chip
              label={`${laps.length} lap${laps.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>

      {laps.length > 0 && <LapList laps={laps} />}
    </Box>
  );
}
