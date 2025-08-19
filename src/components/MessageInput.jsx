// --- START OF FILE frontend/src/components/MessageInput.jsx (VERSIÓN CON IMPORTACIÓN CORREGIDA) ---

import React, { useState, useCallback, useEffect } from 'react'; // <-- ¡LÍNEA CORREGIDA!
import { useDropzone } from 'react-dropzone';
import { Box, Button, IconButton, Typography, Paper, TextField } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

function MessageInput({ onSendMessage, loading }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSendMessage(message.trim(), file);
    setMessage('');
    setFile(null);
    setFilePreview(null);
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  return (
    <Box>
      {file && (
        <Paper elevation={1} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', bgcolor: 'action.hover' }}>
          {filePreview ? <img src={filePreview} alt="Preview" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />
                       : <AttachFileIcon sx={{ mr: 1 }} />}
          <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>{file.name}</Typography>
          <IconButton size="small" onClick={removeFile}><CloseIcon fontSize="small" /></IconButton>
        </Paper>
      )}
      <Box {...getRootProps()} sx={{ border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider', borderRadius: 2, p: 2, textAlign: 'center', cursor: 'pointer', mb: 2 }}>
        <input {...getInputProps()} />
        <Typography variant="body2" color="text.secondary">Arrastra un archivo o haz clic para seleccionar</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={5}
          variant="outlined"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !loading) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              padding: '10px 14px',
            },
          }}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading || (!message.trim() && !file)} sx={{ borderRadius: '25px', px: 3, height: 'fit-content', py: 1.5 }}>
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </Box>
    </Box>
  );
}

export default MessageInput;
// --- END OF FILE frontend/src/components/MessageInput.jsx ---