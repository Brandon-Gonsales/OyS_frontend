import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useAuth } from './context/AuthContext';
import apiClient from './api/axios';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ChatView from './views/ChatView';
import ProjectInfoView from './views/ProjectInfoView';

function AppLogic({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allChats, setAllChats] = React.useState([]);
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleNewChat = React.useCallback(async () => {
    try {
      const { data } = await apiClient.post('/chats');
      setAllChats(prev => [data, ...prev]);
      setActiveChatId(data._id);
      navigate(`/chat/${data._id}`);
    } catch (err) { setError("No se pudo crear un nuevo chat."); }
  }, [navigate]);

  const fetchChats = React.useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/chats');
      setAllChats(data);
      if (data.length > 0) {
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          navigate(`/chat/${data[0]._id}`, { replace: true });
        }
      } else { await handleNewChat(); }
    } catch (err) { setError("No se pudieron cargar los chats."); }
    finally { setLoading(false); }
  }, [user, navigate, handleNewChat]);

  React.useEffect(() => { fetchChats(); }, [fetchChats]);

  const handleDeleteChat = React.useCallback(async (chatIdToDelete) => {
    const originalChats = [...allChats];
    const newChats = allChats.filter(c => c._id !== chatIdToDelete);
    setAllChats(newChats);
    if (window.location.pathname.includes(chatIdToDelete)) {
      if (newChats.length > 0) navigate(`/chat/${newChats[0]._id}`);
      else await handleNewChat();
    }
    try { await apiClient.delete(`/chats/${chatIdToDelete}`); }
    catch { setAllChats(originalChats); }
  }, [allChats, navigate, handleNewChat]);

  const handleChatUpdate = (updatedChat) => {
    setAllChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout allChats={allChats} activeChatId={activeChatId} setActiveChatId={setActiveChatId} handleNewChat={handleNewChat} handleDeleteChat={handleDeleteChat} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route index element={allChats.length > 0 ? <Navigate to={`/chat/${allChats[0]._id}`} replace /> : <Typography sx={{ p: 3 }}>Crea un chat para comenzar.</Typography>} />
          <Route path="chat/:chatId" element={<ChatView onChatUpdate={handleChatUpdate} />} />
          <Route path="info" element={<ProjectInfoView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default AppLogic;