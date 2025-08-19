import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Alert, Snackbar, CircularProgress } from '@mui/material';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import apiClient from '../api/axios';

function ChatView({ onChatUpdate }) {
  const { chatId } = useParams();
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    setLoading(true); setError(null);
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      setCurrentChat(data);
    } catch (err) { setError("No se pudo cargar la conversación."); }
    finally { setLoading(false); }
  }, [chatId]);

  useEffect(() => { fetchChat(); }, [fetchChat]);

  const handleSendMessage = async (userText, file) => {
    if (!currentChat || (!userText.trim() && !file)) return;
    setLoading(true); setError(null);
    try {
      let chatAfterFileUpload = currentChat;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatId', currentChat._id);
        const { data: fileResponse } = await apiClient.post('/process-document', formData);
        chatAfterFileUpload = fileResponse.updatedChat;
        setCurrentChat(chatAfterFileUpload);
        onChatUpdate(chatAfterFileUpload);
      }
      if (userText.trim()) {
        const historyForApi = [...chatAfterFileUpload.messages, { sender: 'user', text: userText }].map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
        const { data } = await apiClient.post('/chat', { conversationHistory: historyForApi, documentId: chatAfterFileUpload.documentId, chatId: chatAfterFileUpload._id });
        setCurrentChat(data.updatedChat);
        onChatUpdate(data.updatedChat);
      }
    } catch (err) { setError(`Error: ${err.response?.data?.message || err.message}`); }
    finally { setLoading(false); }
  };

  if (loading && !currentChat) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!currentChat) return <Typography sx={{ p: 3 }}>Selecciona un chat para comenzar.</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{currentChat.title}</Typography>
      </Box>
      <MessageList conversation={currentChat.messages} loading={loading} onCopy={() => setSnackbarOpen(true)} />
      <Box sx={{ mt: 'auto' }}>
        <MessageInput onSendMessage={handleSendMessage} loading={loading} />
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Texto copiado!" />
    </Paper>
  );
}
export default ChatView;