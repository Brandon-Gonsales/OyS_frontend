import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* El BrowserRouter se elimina de App.js y vive aquí, envolviendo todo */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);