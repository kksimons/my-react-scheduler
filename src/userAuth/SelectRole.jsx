

import React, { useEffect } from 'react'; // Correctly import useEffect
import { Box, Button, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '@theme/theme';
import { ThemeProvider } from '@mui/material';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '@userAuth/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const SelectRole = () => { 
    const navigate = useNavigate();

    // Authentication state
    const [user, loading, error] = useAuthState(auth);

    // Redirect unauthenticated users to SignIn
    useEffect(() => {
        if (loading) return;
        if (!user) {
            console.error("User is not authenticated.");
            // navigate('/SignUp');
            //display message to user
            return(error); 
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    bgcolor="background.default"
                    p={2}
                >
                    <Typography variant="h6">Loading...</Typography>
                </Box>
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    bgcolor="background.default"
                    p={2}
                >
                    <Typography variant="h6" color="error">
                        Error: {error.message}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate('/SignIn')} 
                        sx={{ mt: 2 }}
                    >
                        Go to Sign In
                    </Button>
                </Box>
            </ThemeProvider>
        );
    }

    // If user is authenticated
    if (user) {
        const { uid, email } = user;

        // Handle Role Selection
        const handleRoleSelection = async (role) => {
            const collectionName = role === 'employer' ? 'employers' : 'employees';

            try {
                await setDoc(doc(db, collectionName, uid), {
                    role,
                    email,
                });
                console.log(`User document created in ${collectionName} with UID: ${uid}`);

                // Navigate to respective registration forms
                navigate(role === 'employer' ? '/EmployerRegistration' : '/EmployeeRegistration');
            } catch (error) {
                console.error("Error selecting role:", error);
                // Optionally, display an error message to the user (e.g., using toast notifications)
            }
        };

        return (
            <ThemeProvider theme={theme}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    bgcolor="background.default"
                    p={2}
                    width="100%"
                >
                    {/* Header with Back Button */}
                    <Box
                        display="flex"
                        width="100%"
                        justifyContent="flex-start"
                        mb={4}
                    >
                        <Button 
                            variant="outlined"
                            color="primary"
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={() => {
                                console.log("Back button clicked");
                                
                                navigate(-1, { state: { fromSelectRole: true } }); // Pass state
                            }}
                            sx={{
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                },
                            }}
                        > 
                            Back
                        </Button>
                    </Box>

                    <Typography variant="h4" align="center" gutterBottom>
                        Select Your Role
                    </Typography>

                    {/* Role Selection Cards */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                        sx={{ mt: 4 }}
                    >
                        {/* Employer Card */}
                        <Card sx={{ width: 250 }}>
                            <CardActionArea onClick={() => handleRoleSelection('employer')}>
                                <Box display="flex" flexDirection="column" alignItems="center" p={4}>
                                    <ManageAccountsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                                    <CardContent>
                                        <Typography variant="h5" component="div" align="center">
                                            Employer
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Manage your schedule and employees.
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>

                        {/* Employee Card */}
                        <Card sx={{ width: 250 }}>
                            <CardActionArea onClick={() => handleRoleSelection('employee')}>
                                <Box display="flex" flexDirection="column" alignItems="center" p={4}>
                                    <Diversity1Icon sx={{ fontSize: 60, color: 'secondary.main' }} />
                                    <CardContent>
                                        <Typography variant="h5" component="div" align="center">
                                            Employee
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            View schedule and stay on the same page with your team.
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }

    return null; // Fallback
};

export default SelectRole;
