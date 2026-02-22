import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { ProgressRing } from '../timers/ProgressRing';
import { useEmbedTimerStore } from '../../stores/embedTimerStore';
import { formatTime } from '../../utils/timeCalculations';

export function EmbedFull() {
  const label = useEmbedTimerStore((s) => s.label);
  const remainingTime = useEmbedTimerStore((s) => s.remainingTime);
  const totalSeconds = useEmbedTimerStore((s) => s.totalSeconds);
  const status = useEmbedTimerStore((s) => s.status);
  const start = useEmbedTimerStore((s) => s.start);
  const pause = useEmbedTimerStore((s) => s.pause);
  const reset = useEmbedTimerStore((s) => s.reset);

  const progress = totalSeconds > 0 ? remainingTime / totalSeconds : 0;
  const isRunning = status === 'running';
  const isCompleted = status === 'completed';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5">{label}</Typography>
      <ProgressRing progress={progress} size={180}>
        <Typography variant="h5" fontFamily="monospace" fontWeight={700}>
          {formatTime(remainingTime)}
        </Typography>
      </ProgressRing>
      <Stack direction="row" spacing={1} justifyContent="center">
        {isRunning ? (
          <IconButton color="primary" onClick={pause}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            onClick={start}
            disabled={isCompleted && remainingTime <= 0}
          >
            <PlayArrowIcon />
          </IconButton>
        )}
        <IconButton onClick={reset}>
          <ReplayIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
