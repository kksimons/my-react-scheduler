
import React from 'react';
import {  Typography, Box } from '@mui/material';
// import { styled } from '@mui/system';


import SignOut from '../userAuth/services/SignOut';


const ManagerDashBoard = () => { 
    return (
        <Typography> 
            Manager DashBoard: 

                <SignOut />
               
        </Typography>
    );
}
export default ManagerDashBoard;