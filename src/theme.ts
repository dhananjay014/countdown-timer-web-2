import { createTheme, type Theme } from '@mui/material/styles';

const sharedComponents = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      },
    },
  },
  MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none' as const } } },
  MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'scale(1.1)' },
      },
    },
  },
};

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6750A4' },
    secondary: { main: '#625B71' },
    background: { default: '#FEF7FF', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h3: { fontSize: '2.5rem', fontWeight: 700 },
    h4: { fontSize: '1.75rem', fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
  },
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...sharedComponents.MuiCard.styleOverrides.root,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(103, 80, 164, 0.08)',
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D0BCFF' },
    secondary: { main: '#CCC2DC' },
    background: { default: '#1C1B1F', paper: '#2B2930' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h3: { fontSize: '2.5rem', fontWeight: 700 },
    h4: { fontSize: '1.75rem', fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
  },
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...sharedComponents.MuiCard.styleOverrides.root,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(43, 41, 48, 0.85)',
          border: '1px solid rgba(208, 188, 255, 0.08)',
        },
      },
    },
  },
});
