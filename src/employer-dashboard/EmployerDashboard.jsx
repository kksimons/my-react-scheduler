
import React from 'react';
import {  Typography, Box } from '@mui/material';
import SignOut from '@userAuth/services/SignOut';
import EmployerDashboardLayout from './EmployerDashboardLayout';


//// This is the components to displayed everything on the employer view, you will import all the component here ! 
const EmployerDashBoard = () => { 
    return (
        <Box>
        
        <EmployerDashboardLayout />  
        <Typography> 

        Admin DashBoard: 

        </Typography>
        <SignOut />
        </Box>
    );
}
export default EmployerDashBoard;
