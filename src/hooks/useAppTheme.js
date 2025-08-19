import { useState, useEffect, useMemo, useCallback } from 'react';
import { createTheme } from '@mui/material/styles';

export default function useAppTheme() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#82b1ff' : '#1976d2' },
      secondary: { main: darkMode ? '#ff8a80' : '#dc004e' },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#212121',
        secondary: darkMode ? '#b0b0b0' : '#757575',
      },
    },
  }), [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(prevMode => !prevMode), []);

  return { theme, darkMode, toggleDarkMode };
}