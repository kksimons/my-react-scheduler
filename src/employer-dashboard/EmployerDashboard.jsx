
import React from 'react';
import { Box } from '@mui/material';
import SignOut from '@userAuth/services/SignOut';
// import EmployerDashboardLayout from './employerNavigation';
import EmployerNavigation from './employerNavigation';


//// This is the components to displayed everything on the employer view, you will import all the component here ! 
const EmployerDashBoard = () => { 
    return (
        <Box>
            <EmployerNavigation />
            <SignOut />
        </Box>
    );
}

export default EmployerDashBoard;
