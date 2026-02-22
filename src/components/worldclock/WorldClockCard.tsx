import { memo, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import type { WorldClock } from '../../types/worldClock';
import { useWorldClockStore } from '../../stores/worldClockStore';
import { formatTimeInZone, formatDateInZone, getUtcOffset } from '../../utils/timezoneFormat';

interface WorldClockCardProps {
  clock: WorldClock;
}

export const WorldClockCard = memo(function WorldClockCard({ clock }: WorldClockCardProps) {
  const removeClock = useWorldClockStore((s) => s.removeClock);

  const [time, setTime] = useState(() => formatTimeInZone(clock.timezone));
  const [date, setDate] = useState(() => formatDateInZone(clock.timezone));
  const [offset, setOffset] = useState(() => getUtcOffset(clock.timezone));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatTimeInZone(clock.timezone));
      setDate(formatDateInZone(clock.timezone));
      setOffset(getUtcOffset(clock.timezone));
    }, 1000);

    return () => clearInterval(id);
  }, [clock.timezone]);

  return (
    <Card sx={{
      transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {clock.label}
            </Typography>
            <Typography
              variant="h3"
              fontFamily="monospace"
              fontWeight={700}
              sx={{ my: 1 }}
            >
              {time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
            <Chip
              label={offset}
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
          <IconButton
            size="small"
            color="error"
            onClick={() => removeClock(clock.id)}
            aria-label={`Delete ${clock.label}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
});
