import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from '@theme/theme';


//use the new createRoot API from React 18 (any) to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>

);
