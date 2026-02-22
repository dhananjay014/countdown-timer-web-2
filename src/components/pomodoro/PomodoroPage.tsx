import { memo } from 'react';
import Stack from '@mui/material/Stack';
import { usePomodoroTick } from '../../hooks/usePomodoroTick';
import { PomodoroDisplay } from './PomodoroDisplay';
import { PomodoroSettings } from './PomodoroSettings';
import { PomodoroHistory } from './PomodoroHistory';

export const PomodoroPage = memo(function PomodoroPage() {
  usePomodoroTick();

  return (
    <Stack spacing={3} alignItems="center">
      <PomodoroDisplay />
      <PomodoroSettings />
      <PomodoroHistory />
    </Stack>
  );
});
