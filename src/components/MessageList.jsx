import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Avatar, IconButton, Tooltip, CircularProgress, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageList({ conversation, loading, onCopy }) {
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation, loading]);
  return (
    <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2, flexGrow: 1, overflowY: 'auto', mb: 2, bgcolor: 'background.default' }}>
      {conversation.map((msg, index) => {
        const isUser = msg.sender === 'user';
        return (
          <Box key={index} className="message-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, maxWidth: '100%' }}>
              {!isUser && <Avatar sx={{ bgcolor: 'secondary.main' }}><SmartToyIcon /></Avatar>}
              <Box sx={{ maxWidth: '80%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: isUser ? 'right' : 'left', mb: 0.5 }}>{isUser ? 'Tú' : 'Asistente AI'}</Typography>
                <Paper elevation={1} className={`message ${isUser ? 'user' : 'bot'}`} sx={{ p: 1.5, borderRadius: '20px', bgcolor: isUser ? 'primary.main' : 'background.paper', color: isUser ? 'primary.contrastText' : 'text.primary', borderBottomLeftRadius: isUser ? '20px' : '5px', borderBottomRightRadius: isUser ? '5px' : '20px' }}>
                  {msg.sender !== 'user' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown> : <Typography variant="body1">{msg.text}</Typography>}
                </Paper>
              </Box>
              {isUser && <Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, px: '50px' }}>
              {!isUser && !msg.error && <Tooltip title="Copiar"><IconButton onClick={() => onCopy(msg.text)} size="small"><ContentCopyIcon fontSize="inherit" /></IconButton></Tooltip>}
            </Box>
          </Box>
        );
      })}
      {loading && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}><CircularProgress size={20} color="inherit" sx={{ mr: 1.5 }} /><Typography variant="body2" fontStyle="italic">Escribiendo...</Typography></Box>}
      <div ref={messagesEndRef} />
    </Box>
  );
}
export default MessageList;