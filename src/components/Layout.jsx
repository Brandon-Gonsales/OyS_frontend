// --- VERSIÓN APROBADA de frontend/src/components/Layout.jsx ---

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

function Layout({ allChats, handleNewChat, handleDeleteChat, darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Modelo de Asistencia OyS</Typography>
          <Typography sx={{ mr: 2 }}>Hola, {user?.name}</Typography>
          {/* Botón de Modo Oscuro/Claro, reintegrado y funcional */}
          <Button color="inherit" onClick={toggleDarkMode}>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Salir</Button>
        </Toolbar>
      </AppBar>
      <Sidebar allChats={allChats} handleNewChat={handleNewChat} handleDeleteChat={handleDeleteChat} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: {sm: 'calc(100% - 240px)'} }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
export default Layout;