import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal"/>
          <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required margin="normal"/>
          <Box sx={{ mt: 2 }}><Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5 }}>{loading ? <CircularProgress size={24} /> : 'Entrar'}</Button></Box>
        </form>
         <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>¿No tienes cuenta? <Button onClick={() => navigate('/register')}>Regístrate</Button></Typography>
      </Paper>
    </Box>
  );
};
export default LoginPage;