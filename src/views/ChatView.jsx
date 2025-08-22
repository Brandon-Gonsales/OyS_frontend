import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import apiClient from "../api/axios";

// Componentes de notificación personalizados hola
const CircularProgress = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
);

const Alert = ({ severity, children }) => {
  const bgColor =
    severity === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-blue-100 border-blue-400 text-blue-700";
  return (
    <div className={`border px-4 py-3 rounded ${bgColor}`} role="alert">
      {children}
    </div>
  );
};

const Snackbar = ({ open, onClose, message, autoHideDuration = 2000 }) => {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
        <span className="mr-4">{message}</span>
        <button onClick={onClose} className="text-gray-300 hover:text-white">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

function ChatView({ onChatUpdate }) {
  const { chatId } = useParams();
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      setCurrentChat(data);
    } catch (err) {
      setError("No se pudo cargar la conversación.");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleSendMessage = async (userText, file) => {
    if (!currentChat || (!userText.trim() && !file)) return;
    setLoading(true);
    setError(null);

    try {
      let chatAfterFileUpload = currentChat;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatId", currentChat._id);
        const { data: fileResponse } = await apiClient.post(
          "/process-document",
          formData
        );
        chatAfterFileUpload = fileResponse.updatedChat;
        setCurrentChat(chatAfterFileUpload);
        onChatUpdate(chatAfterFileUpload);
      }

      if (userText.trim()) {
        const historyForApi = [
          ...chatAfterFileUpload.messages,
          { sender: "user", text: userText },
        ].map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

        const { data } = await apiClient.post("/chat", {
          conversationHistory: historyForApi,
          documentId: chatAfterFileUpload.documentId,
          chatId: chatAfterFileUpload._id,
        });

        setCurrentChat(data.updatedChat);
        onChatUpdate(data.updatedChat);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !currentChat) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  // No chat selected state
  if (!currentChat) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Selecciona un chat para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {currentChat.title}
        </h2>
      </div> */}

      {/* Message List */}
      <MessageList
        conversation={currentChat.messages}
        loading={loading}
        onCopy={() => setSnackbarOpen(true)}
      />

      {/* Message Input */}
      <div className="mt-auto">
        <MessageInput onSendMessage={handleSendMessage} loading={loading} />
      </div>

      {/* Snackbar */}
      {/* <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={() => setSnackbarOpen(false)} 
        message="Texto copiado!" 
      /> */}
    </div>
  );
}

export default ChatView;
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { Typography, Box, Paper, Alert, Snackbar, CircularProgress } from '@mui/material';
// import MessageList from '../components/MessageList';
// import MessageInput from '../components/MessageInput';
// import apiClient from '../api/axios';

// function ChatView({ onChatUpdate }) {
//   const { chatId } = useParams();
//   const [currentChat, setCurrentChat] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const fetchChat = useCallback(async () => {
//     if (!chatId) return;
//     setLoading(true); setError(null);
//     try {
//       const { data } = await apiClient.get(`/chats/${chatId}`);
//       setCurrentChat(data);
//     } catch (err) { setError("No se pudo cargar la conversación."); }
//     finally { setLoading(false); }
//   }, [chatId]);

//   useEffect(() => { fetchChat(); }, [fetchChat]);

//   const handleSendMessage = async (userText, file) => {
//     if (!currentChat || (!userText.trim() && !file)) return;
//     setLoading(true); setError(null);
//     try {
//       let chatAfterFileUpload = currentChat;
//       if (file) {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('chatId', currentChat._id);
//         const { data: fileResponse } = await apiClient.post('/process-document', formData);
//         chatAfterFileUpload = fileResponse.updatedChat;
//         setCurrentChat(chatAfterFileUpload);
//         onChatUpdate(chatAfterFileUpload);
//       }
//       if (userText.trim()) {
//         const historyForApi = [...chatAfterFileUpload.messages, { sender: 'user', text: userText }].map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
//         const { data } = await apiClient.post('/chat', { conversationHistory: historyForApi, documentId: chatAfterFileUpload.documentId, chatId: chatAfterFileUpload._id });
//         setCurrentChat(data.updatedChat);
//         onChatUpdate(data.updatedChat);
//       }
//     } catch (err) { setError(`Error: ${err.response?.data?.message || err.message}`); }
//     finally { setLoading(false); }
//   };

//   if (loading && !currentChat) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!currentChat) return <Typography sx={{ p: 3 }}>Selecciona un chat para comenzar.</Typography>;

//   return (
//     <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
//       <div className='text-red-500'>holw</div>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h6">{currentChat.title}</Typography>
//       </Box>
//       <MessageList conversation={currentChat.messages} loading={loading} onCopy={() => setSnackbarOpen(true)} />
//       <Box sx={{ mt: 'auto' }}>
//         <MessageInput onSendMessage={handleSendMessage} loading={loading} />
//       </Box>
//       <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Texto copiado!" />
//     </Paper>
//   );
// }
// export default ChatView;
