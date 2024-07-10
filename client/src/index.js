import React from 'react';
import ReactDOM from 'react-dom';
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

// Use ReactDOM.render for older React versions or when not using concurrent mode
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
