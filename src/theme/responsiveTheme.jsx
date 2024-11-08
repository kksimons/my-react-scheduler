import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let responsiveTheme = createTheme({
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

  // Customize responsive layout settings
  layout: {
    body: {
      // Define body width for each breakpoint based on your layout needs
      xs: '100%',              // Extra-small devices
      sm: '100%',              // Small devices (scaling)
      md: '840px',             // Medium devices, fixed 840dp
      lg: '1040px',            // Large devices, fixed 1040dp
      xl: '1040px',            // Extra-large devices, fixed 1040dp
    },
    // margin: {
    //   xs: '16px',              // 16dp margin on extra-small devices
    //   sm: '32px',              // 32dp margin on small devices
    //   md: '200px',             // 200dp margin on medium devices
    //   lg: 'scaling',           // Scaling as needed
    //   xl: 'scaling',           // Scaling as needed
    // },
  },

  // Typography (if you need responsive font scaling)
  typography: {
    h1: {
      fontSize: '2rem',
      [`@media (min-width:600px)`]: {
        fontSize: '2.5rem',
      },
      [`@media (min-width:905px)`]: {
        fontSize: '3rem',
      },
      [`@media (min-width:1240px)`]: {
        fontSize: '3.5rem',
      },
      [`@media (min-width:1440px)`]: {
        fontSize: '4rem',
      },
    },

    // Body1 typography
    body1: {
        fontSize: '1rem',
        [`@media (min-width:600px)`]: {
          fontSize: '1.125rem',
        },
        [`@media (min-width:905px)`]: {
          fontSize: '1.25rem',
        },
        [`@media (min-width:1240px)`]: {
          fontSize: '1.375rem',
        },
        [`@media (min-width:1440px)`]: {
          fontSize: '1.5rem',
        },
      },
    // Define other typography levels if needed
  },
});

responsiveTheme = responsiveFontSizes(responsiveTheme);

export default responsiveTheme;
