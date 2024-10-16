// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/reset.css'; // or 'antd/dist/antd.css' based on your version
import 'react-big-scheduler-stch/lib/css/style.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
