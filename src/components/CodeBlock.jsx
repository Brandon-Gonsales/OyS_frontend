import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material'; // Asegúrate de importar IconButton
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function CodeBlock({ title, language, code }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Comando copiado al portapapeles!');
  };

  return (
    <Paper elevation={1} sx={{ bgcolor: 'background.paper', p: 2, mb: 3, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {language}
          </Typography>
          <IconButton size="small" onClick={handleCopy} sx={{ color: 'text.secondary' }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#eee', p: 1, borderRadius: 1, overflowX: 'auto' }}>
        <pre style={{ margin: 0, color: (theme) => theme.palette.text.primary }}>
          <code>{code}</code>
        </pre>
      </Box>
    </Paper>
  );
}

export default CodeBlock;