import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  // Breakpoints for responsive layout
  breakpoints: {
    values: {
      xs: 0,         // Extra-small devices (phones)
      sm: 600,       // Small devices (tablets)
      md: 905,       // Medium devices (laptops)
      lg: 1240,      // Large devices (desktops)
      xl: 1440,      // Extra-large devices
    },
  },

  spacing: 8, // Default spacing unit

  // Layout settings for different screen sizes
  layout: {
    body: {
      xs: '100%',              // Extra-small devices
      sm: '100%',              // Small devices (scaling)
      md: '840px',             // Medium devices, fixed 840dp
      lg: '1040px',            // Large devices, fixed 1040dp
      xl: '1040px',            // Extra-large devices, fixed 1040dp
    },
    // Uncomment if you need custom margin for layout
    // margin: {
    //   xs: '16px',              // 16dp margin on extra-small devices
    //   sm: '32px',              // 32dp margin on small devices
    //   md: '200px',             // 200dp margin on medium devices
    //   lg: 'scaling',           // Scaling as needed
    //   xl: 'scaling',           // Scaling as needed
    // },
  },

  // Color palette for the application
  palette: {
    primary: {
      main: '#5340ff',         // Primary color for buttons, etc.
      contrastText: '#ffffff', // Contrast text color for primary
    },
    secondary: {
      main: '#3532db',         // Secondary color
    },
    text: {
      primary: '#2a2a2a',      // Default text color
      secondary: '#3d3d3d',    // Secondary text color
      accent: '#575757',       // Accent color for specific text
      link: '#6666ff',         // Link color
    },
    background: {
      primary: '#f4f4f8',      // Main background color
      secondary: '#eaeaf2',    // Background for sections like cards
      third: 'white',          // Background for main content area
      alternative: '#dfe0e6',  // Background for input fields, etc.
      accent: '#f0f2ff',       // Accent background for focus areas
    },
  },

  // Typography (if you need responsive font scaling)
  typography: {
    // Heading 1 (h1) with responsive font scaling
    h1: {
      fontSize: '36px',
      fontWeight: 600,
      [`@media (min-width:600px)`]: {
        fontSize: '32px',
      },
      [`@media (min-width:905px)`]: {
        fontSize: '32px',
      },
      [`@media (min-width:1240px)`]: {
        fontSize: '36px',
      },
      [`@media (min-width:1440px)`]: {
        fontSize: '36px',
      },
    },

    // Body1 typography (default text style, starts at 18px)
    body1: {
      fontSize: '18px', // 18px
      color: '#2a2a2a', // Default color for body1
      [`@media (min-width:600px)`]: {
        fontSize: '18px', // 18px
      },
      [`@media (min-width:905px)`]: {
        fontSize: '18px', // 20px
      },
      [`@media (min-width:1240px)`]: {
        fontSize: '18px', // 22px
      },
      [`@media (min-width:1440px)`]: {
        fontSize: '18px', // 24px
      },
    },

    // Body2 typography (secondary body text, starts at 16px)
    body2: {
      fontSize: '16px', // Approximately 16px
      color: '#3d3d3d',
    },

    // Subtitle1 typography (used for less prominent text)
    subtitle1: {
      color: '#575757', // Accent color for subtitles
    },

    // Link typography (for text links)
    link: {
      color: '#6666ff', // Color for links
    },
  },

  // Component Overrides
  components: {
    // Style overrides for form labels
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 100,       // Font weight for labels
          marginBottom: '0.7rem', // Spacing below label
          fontSize: '18px',      // Font size for labels
        },
      },
    },

    // Style overrides for form controls
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: '0.2rem', // Spacing between form fields
        },
      },
    },

    // Style overrides for buttons
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white', // White text color
          backgroundColor: '#5340ff', // Primary button color
          fontSize: '18px', // Standardize button text size
          textTransform: 'none', // Prevent uppercase transformation
          padding: '0.6rem 0.8rem', // Standard padding for buttons
          borderRadius: '1rem', // Rounded corners
          boxShadow: 'none', // Remove default shadow if desired
          '&:hover': {
            padding: '0.7rem 0.8rem', // Standard padding for buttons
            borderRadius: '1rem', // Rounded corners
            backgroundColor: '#3532db', // Hover color
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Add a subtle shadow on hover
          },
        },
      },
      
    },
    
  },
});

// Apply responsive font sizes globally
theme = responsiveFontSizes(theme);

export default theme;
