
import React from 'react';
import {  Typography, Box } from '@mui/material';
// import { styled } from '@mui/system';
//import ServersSchedule from '@schedules/ServersSchedule';
import DashboardLayoutBasic from '@schedules/Dashboard';

import SignOut from '../userAuth/services/SignOut';


const ManagerDashBoard = () => { 
    return (
        <Box>
            <Typography> 
                Manager DashBoard: 

                <SignOut />
                {/* <ServersSchedule /> */}
               
        </Typography>
            <DashboardLayoutBasic />
        </Box>
    );
}
export default ManagerDashBoard;