import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './standalone/App.jsx';
import './index.css';

import { ensureObservabilityGlobals } from './utils/observability.js';

// Ensure GA/Zipy globals exist in local/isolated runs.
ensureObservabilityGlobals();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

