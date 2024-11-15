
import React from 'react';
import { Box } from '@mui/material';
import SignOut from '@userAuth/services/SignOut';
import EmployerDashboardLayout from './employerNavigation';


//// This is the components to displayed everything on the employer view, you will import all the component here ! 
const EmployerDashBoard = () => { 
    return (
        <Box>
            <EmployerDashboardLayout />
            <SignOut />
        </Box>
    );
}

export default EmployerDashBoard;
