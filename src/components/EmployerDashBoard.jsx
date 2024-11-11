
import React from 'react';
import {  Typography, Box } from '@mui/material';
import SignOut from '../userAuth/services/SignOut';
import Dashboard from '../schedules/Dashboard';


const EmployerDashBoard = () => { 
    return (
        <Box>
            <Typography> 
                Admin DashBoard: 

                <SignOut />
               
        </Typography>
            <Dashboard />
        </Box>
    );
}
export default EmployerDashBoard;