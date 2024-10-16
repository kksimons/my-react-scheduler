

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import SchedulerContainer from '../schedules/SchedulerContainer';
const ManagerDashBoard: React.FC = () => { 
    return (
        <Typography> 
            This Is Employee DashBoard: 
                Available Page: 
                <Box>
                    <SchedulerContainer/>
                </Box>
               
        </Typography>
    );
}
export default ManagerDashBoard;