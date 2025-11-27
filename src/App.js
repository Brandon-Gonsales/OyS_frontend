import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import useAppTheme from './hooks/useAppTheme';
import AppLogic from './AppLogic';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import UsersPage from './views/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { theme, darkMode, toggleDarkMode } = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route
            path="/*"
            element={<AppLogic darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;