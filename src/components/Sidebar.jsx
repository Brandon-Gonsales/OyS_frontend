import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, IconButton, TextField, InputAdornment, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function Sidebar({ allChats, handleNewChat, handleDeleteChat, activeChatId, setActiveChatId }) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredChats = allChats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar><Typography variant="h6" noWrap>Modelo de Asistencia OyS</Typography></Toolbar>
      <Divider />
      <List><ListItemButton onClick={handleNewChat}><ListItemIcon><AddIcon /></ListItemIcon><ListItemText primary="Nuevo Chat" /></ListItemButton></List>
      <Divider />
      <Box sx={{ p: 2 }}><TextField fullWidth size="small" variant="outlined" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>), sx: { borderRadius: '25px' } }}/></Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {filteredChats.map((chat) => (
          <ListItem key={chat._id} disablePadding secondaryAction={<IconButton edge="end" onClick={() => handleDeleteChat(chat._id)}><DeleteIcon fontSize="small" /></IconButton>}>
            <ListItemButton selected={chatId === chat._id} onClick={() => navigate(`/chat/${chat._id}`)}>
              <ListItemText primary={chat.title} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List><ListItemButton onClick={() => navigate('/info')}><ListItemIcon><InfoIcon /></ListItemIcon><ListItemText primary="Información" /></ListItemButton></List>
    </Box>
  );
}
export default Sidebar;