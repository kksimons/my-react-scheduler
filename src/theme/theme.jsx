import { createTheme } from '@mui/material/styles';

let theme = responsiveFontSizes({

        palette: {
            primary: {
                main: '#5340ff',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#3532db',
            },
            text: {
                primary: '#2a2a2a',
                secondary: '#3d3d3d',
                accent: '#575757',
                link: '#6666ff',
            },
            background: {
                primary: '#f4f4f8', //A very light gray with a hint of cool tone
                secondary: '#eaeaf2', // grouping content in sections like cards or form fields
                third: 'white', // background for the main content area
                alternative: '#dfe0e6', // smaller components like input fields, hover states on form fields, or section divider
                accent: '#f0f2ff', //Accent Background (for focus areas or notifications):
            },
        },
        // typography: {
        //     fontFamily: 'Poppins, sans-serif',
        //     h1: {
        //         color: '#2a2a2a',
        //     },
        //     body1: {
        //         color: '#3d3d3d',
        //         font: '18px',
        //     },
        //     subtitle1: {
        //         color: '#575757',
        //     },
        //     link: {
        //         color: '#6666ff',
        //     },
        // },

        //Typography
        typography: {
            body1: {
                fontSize: '1.125rem', // Approximately 18px
                },
                body2: {
                fontSize: '1rem', // Approximately 16px
                },
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
        },  
        
        components: {
            MuiFormLabel: {
                styleOverrides: {
                root: {
                    fontWeight: 100, // Sets a bolder font weight for all labels
                    marginBottom: '0.7rem', // Adds space between the label and the input field
                    fontSize: '18px', // Sets the font size for all labels
                },
                },
            },
            MuiFormControl: {
                styleOverrides: {
                root: {
                    marginBottom: '0.2rem', // Adds consistent spacing between form fields
                },
                },
            },

            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#5340ff',
                        '&:hover': {
                            backgroundColor: '#3532db',
                        },
                    },
                },
            },
        },
    });

    theme = responsiveFontSizes(theme);

export default theme;