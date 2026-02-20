import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import type { Lap } from '../../types';

function formatLapTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

interface LapListProps {
  laps: Lap[];
}

export function LapList({ laps }: LapListProps) {
  const { bestIdx, worstIdx } = useMemo(() => {
    if (laps.length < 2) return { bestIdx: -1, worstIdx: -1 };
    let best = 0;
    let worst = 0;
    for (let i = 1; i < laps.length; i++) {
      if (laps[i].time < laps[best].time) best = i;
      if (laps[i].time > laps[worst].time) worst = i;
    }
    return { bestIdx: best, worstIdx: worst };
  }, [laps]);

  return (
    <Card sx={{ width: '100%', maxWidth: 480 }}>
      <Stack spacing={0} sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {laps.map((lap, idx) => {
          const isBest = idx === bestIdx;
          const isWorst = idx === worstIdx;

          return (
            <Box
              key={lap.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                borderBottom: idx < laps.length - 1 ? 1 : 0,
                borderColor: 'divider',
                bgcolor: isBest ? 'success.main' : isWorst ? 'error.main' : 'transparent',
                color: (isBest || isWorst) ? 'common.white' : 'text.primary',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 50 }}>
                  Lap {lap.id}
                </Typography>
                {isBest && <Chip label="Best" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'inherit', height: 20, fontSize: '0.7rem' }} />}
                {isWorst && <Chip label="Worst" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'inherit', height: 20, fontSize: '0.7rem' }} />}
              </Stack>
              <Typography variant="body1" fontFamily="monospace" fontWeight={600}>
                {formatLapTime(lap.time)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
