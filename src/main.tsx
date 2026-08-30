import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign Vite HMR websocket disconnection notices in AI Studio container environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const message = event?.reason?.message || String(event?.reason || '');
    if (message.includes('WebSocket closed without opened') || message.includes('failed to connect to websocket')) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event?.message || '';
    if (message.includes('WebSocket closed without opened') || message.includes('failed to connect to websocket')) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

