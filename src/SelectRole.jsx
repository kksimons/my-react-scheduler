import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate , useLocation } from 'react-router-dom';
import theme from '@theme/theme';
import { ThemeProvider } from '@mui/material';
import { setDoc , doc } from 'firebase/firestore';
import { db, auth } from '@userAuth/firebase';

// thizSelectRole component, allow users to choose between Employer and Employee roles
  //Logic: 
// 1. use the email passed from the SignUp component to create a document in the Firestore database with the user's role and email
const SelectRole = () => { 
  const navigate = useNavigate(); //navigate hoook to navigate to different pages
  const location = useLocation(); //useLocation hook to access the current location 
  const { uid, email } = location.state || {}; //extract the user ID from the location state if it exists
  console.log('UID:', uid);
  console.log('Email:', email);
  if (!uid || !email) {
    console.error("UID or email is missing in SelectRole component.");
    return;
  }

  //handleRoleSelection 
  const handleRoleSelection = async (role) => {
    const collectionName = role === 'employer' ? 'employers' : 'employees'; //determine the collection name based on the selected role 

    try {
      await setDoc(doc(db, collectionName, uid), {
        role,
        email,
      });
      console.log(`User document created in ${collectionName} with UID: ${uid}`);

      // Navigate to the appropriate registration form
      navigate(role === 'employer' ? '/EmployerRegistration' : '/EmployeeRegistration');
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

    

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
        p="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="8px"
          backgroundColor="background.third"
          sx={{
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            p: 6,
            borderRadius: 5,
            boxShadow: 5,
          }}
        >
          <Typography variant="h1" align="center">Select Your Role</Typography>

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRoleSelection('employer')}
              sx={{
                mt: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              Employer
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRoleSelection('employee')}
              sx={{
                mt: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              Employee
            </Button>
          </Box>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SelectRole;
