
import React from 'react';
import {  Typography, Box } from '@mui/material';
import SignOut from '@userAuth/services/SignOut';
import DashboardLayoutBasic from '@schedules/DashboardLayoutBasic';


const EmployerDashBoard = () => { 
    return (
        <Box>
            <Typography> 
                Admin DashBoard: 

                <SignOut />
               
        </Typography>
            <DashboardLayoutBasic />
        </Box>
    );
}
export default EmployerDashBoard;