
import React from 'react';
import {  Typography, Box } from '@mui/material';
// import { styled } from '@mui/system';
import BussersSchedule from @schedules/BussersSchedule;


import SignOut from '../userAuth/services/SignOut';


const ManagerDashBoard = () => { 
    return (
        <Typography> 
            Manager DashBoard: 

                <SignOut />
                <BussersSchedule />
               
        </Typography>
    );
}
export default ManagerDashBoard;