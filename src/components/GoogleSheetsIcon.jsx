import React from 'react';
import { SvgIcon } from '@mui/material';

function GoogleSheetsIcon(props) {
  return (
    <SvgIcon {...props}>
      {/* Contenido SVG del icono de Google Sheets */}
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-3 15v-4h2v4h-2zm3-6V9h-2V7h2V5h-2V3h-2v2H9V3H7v2H5v2h2v2H5v2h2v4h2v-4h2v4h2z" fill="#1E88E5"/> {/* Color azul de Google Sheets */}
    </SvgIcon>
  );
}

export default GoogleSheetsIcon;