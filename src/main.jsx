import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Tablas } from './Tablas';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tablas />
  </StrictMode>
);
