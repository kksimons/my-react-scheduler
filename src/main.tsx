import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create custom theme that has Poppins font for every text
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif', // Set your custom font here
  },
});

// Render the root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Helps reset default styles and applies consistent styling */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
