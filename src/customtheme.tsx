import { createTheme } from "@mui/material";

const CustomTheme = createTheme({
    palette: {
      primary: {
        main: '#5C1CFE',  // Purple
        dark: '#191919',
        light: '#AB9AFF',
        contrastText: '#ffffff',  // White text on primary buttons
      },
      secondary: {
        main: '#9b30ff',  // Lighter purple
        light: '#CDE0FF',
      },

      background: {
        default: 'linear-gradient(97deg, rgba(233,104,255,1) 0%, rgba(69,91,235,1) 37%, rgba(34,24,167,1) 79%)', 
      },
  
    },
    typography: {
      fontSize: 16,
      
    },
  
  
    
    shape: {
      borderRadius: 8, // Global border-radius for buttons and Paper
    },
  });

export default CustomTheme;