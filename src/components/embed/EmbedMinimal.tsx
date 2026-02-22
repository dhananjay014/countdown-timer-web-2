import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProgressRing } from '../timers/ProgressRing';
import { useEmbedTimerStore } from '../../stores/embedTimerStore';
import { formatTime } from '../../utils/timeCalculations';

export function EmbedMinimal() {
  const label = useEmbedTimerStore((s) => s.label);
  const remainingTime = useEmbedTimerStore((s) => s.remainingTime);
  const totalSeconds = useEmbedTimerStore((s) => s.totalSeconds);

  const progress = totalSeconds > 0 ? remainingTime / totalSeconds : 0;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <ProgressRing progress={progress} size={200}>
        <Typography variant="h5" fontFamily="monospace" fontWeight={700}>
          {formatTime(remainingTime)}
        </Typography>
      </ProgressRing>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        {label}
      </Typography>
    </Box>
  );
}
