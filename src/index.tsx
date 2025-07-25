import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import type { ReportHandler } from 'web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log web vitals to console
reportWebVitals((metric: Parameters<ReportHandler>[0]) => {
  console.log(`${metric.name}: ${metric.value}`);
  // You could also send to an analytics service here
});
