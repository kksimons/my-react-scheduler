
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

import { ManagerViewScheduler } from '../schedules/ManagerViewScheduler';
import SignOut from '../userAuth/SignOut';


const ManagerDashBoard: React.FC = () => { 
    return (
        <Typography> 
            Manager DashBoard: 
                <Box>
                    <ManagerViewScheduler />

                </Box>
                <SignOut />
               
        </Typography>
    );
}
export default ManagerDashBoard;