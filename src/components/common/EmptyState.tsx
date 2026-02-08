import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface EmptyStateProps {
  message: string;
  subtitle?: string;
}

export function EmptyState({ message, subtitle }: EmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, opacity: 0.6 }}>
      <HourglassEmptyIcon sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h6">{message}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
  );
}
