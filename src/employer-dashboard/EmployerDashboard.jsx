
import React from 'react';
import {  Typography, Box } from '@mui/material';
import SignOut from '@userAuth/services/SignOut';
import EmployerDashboardLayout from './EmployerDashboardLayout';

const EmployerDashBoard = () => { 
    return (
        <Box>
            <Typography> 
                Admin DashBoard: 
                <SignOut />
                <EmployerDashboardLayout /> 
               
        </Typography>

        </Box>
    );
}
export default EmployerDashBoard;
