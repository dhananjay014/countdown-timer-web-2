import { createTheme, type Theme } from '@mui/material/styles';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6750A4' },
    secondary: { main: '#625B71' },
    background: { default: '#FEF7FF', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: '"Roboto", sans-serif' },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
    MuiFab: { styleOverrides: { root: { borderRadius: 16 } } },
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
  typography: { fontFamily: '"Roboto", sans-serif' },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
    MuiFab: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});
