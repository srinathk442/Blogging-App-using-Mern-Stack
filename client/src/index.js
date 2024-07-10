import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Suppress findDOMNode warnings in development mode
if (process.env.NODE_ENV === 'development') {
  const consoleError = console.error;
  console.error = (message, ...args) => {
    if (typeof message === 'string' && message.includes('findDOMNode')) {
      return;
    }
    consoleError(message, ...args);
  };
}

// Use createRoot for React 18
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
