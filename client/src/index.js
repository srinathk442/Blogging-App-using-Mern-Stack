import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

if (process.env.NODE_ENV === 'development') {
  const consoleError = console.error;
  console.error = (message, ...args) => {
    if (typeof message === 'string' && message.includes('findDOMNode')) {
      return;
    }
    consoleError(message, ...args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
