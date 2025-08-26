import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Visibility, VisibilityOff, Email, Lock, Person, LightMode, DarkMode, Error } from '@mui/icons-material';
import useAppTheme from '../hooks/useAppTheme';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const { theme, darkMode, toggleDarkMode } = useAppTheme();

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-light-bg dark:bg-dark-bg">
      {/* Theme toggle button */}
      <button
              onClick={() => toggleDarkMode()}
              className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 dark:shadow-gray-800/25 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </button>

      {/* Register form container */}
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Crear Cuenta</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Completa los datos para crear tu cuenta
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-light-border dark:border-dark-border">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <Error className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-light-primary dark:text-dark-primary"
              >
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Person className="text-light-secondary dark:text-dark-secondary" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg rounded-xl  text-light-primary dark:text-dark-primary placeholder-light-primary placeholder-opacity-20 dark:placeholder-dark-primary dark:placeholder-opacity-20 focus:outline-none focus:ring-2 focus:ring-light-border dark:focus:ring-dark-border focus:border-light-border dark:focus:border-dark-border transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-light-primary dark:text-dark-primary"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Email className="text-light-secondary dark:text-dark-secondary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg rounded-xl  text-light-primary dark:text-dark-primary placeholder-light-primary placeholder-opacity-20 dark:placeholder-dark-primary dark:placeholder-opacity-20 focus:outline-none focus:ring-2 focus:ring-light-border dark:focus:ring-dark-border focus:border-light-border dark:focus:border-dark-border transition-colors"
                  placeholder="correo"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-light-secondary dark:text-dark-secondary" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg rounded-xl  text-light-primary dark:text-dark-primary placeholder-light-primary placeholder-opacity-20 dark:placeholder-dark-primary dark:placeholder-opacity-20 focus:outline-none focus:ring-2 focus:ring-light-border dark:focus:ring-dark-border focus:border-light-border dark:focus:border-dark-border transition-colors"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-secondary dark:text-dark-secondary hover:text-light-secondary_h dark:hover:text-dark-secondary_h transition-colors"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              <p className="text-xs text-light-primary dark:text-dark-primary">Mínimo 6 caracteres</p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 flex justify-center items-center px-4 border border-transparent rounded-xl text-sm font-medium text-light-bg transition-all duration-200 ${
                loading 
                  ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed' 
                  : 'bg-light-secondary dark:bg-dark-secondary hover:bg-light-secondary_h dark:hover:bg-dark-secondary_h focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-border dark:focus:ring-offset-gray-800 transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-light-border dark:border-dark-border border-t-transparent mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-light-primary dark:text-dark-primary">
              ¿Ya tienes una cuenta?{' '}
              <button
              type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-light-primary dark:text-dark-primary hover:text-light-primary dark:hover:text-dark-primary transition-colors"
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setLoading(true);
//     try {
//       await register(name, email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.toString());
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ p: 2 }}>
//       <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
//         <Typography variant="h4" component="h1" gutterBottom textAlign="center">Crear Cuenta</Typography>
//         <form onSubmit={handleSubmit}>
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//           <TextField label="Nombre" type="text" value={name} onChange={(e) => setName(e.target.value)} fullWidth required margin="normal"/>
//           <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal"/>
//           <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required margin="normal" helperText="Mínimo 6 caracteres."/>
//           <Box sx={{ mt: 2 }}><Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5 }}>{loading ? <CircularProgress size={24} /> : 'Registrarse'}</Button></Box>
//         </form>
//          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>¿Ya tienes una cuenta? <Button onClick={() => navigate('/login')}>Inicia Sesión</Button></Typography>
//       </Paper>
//     </Box>
//   );
// };
// export default RegisterPage;