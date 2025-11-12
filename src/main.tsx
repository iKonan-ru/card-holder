import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { checkSecureProtocol } from '@shared/lib';
import { App } from './app';

checkSecureProtocol();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
