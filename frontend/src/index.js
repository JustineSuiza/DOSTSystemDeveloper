import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-tooltip/dist/react-tooltip.css'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-day-picker/dist/style.css';
import 'jquery';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const normalizeApiUrl = (url) => {
  if (typeof url !== 'string') {
    return url;
  }

  if (url.startsWith('http://localhost:8080') || url.startsWith('https://localhost:8080')) {
    const path = url.replace(/^https?:\/\/localhost:8080/i, '');
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  }

  return url;
};

axios.interceptors.request.use((config) => {
  if (config.url) {
    config.url = normalizeApiUrl(config.url);
  }
  return config;
});

const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  if (typeof input === 'string') {
    return originalFetch(normalizeApiUrl(input), init);
  }

  if (input instanceof Request) {
    return originalFetch(new Request(normalizeApiUrl(input.url), input), init);
  }

  return originalFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
