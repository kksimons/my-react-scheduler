

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import SchedulerContainer from '../schedules/SchedulerContainer';
import { Component } from '../schedules/bitnotScheduler';
const ManagerDashBoard: React.FC = () => { 
    return (
        <Typography> 
            This Is Employee DashBoard: 
                Available Page: 
                <Box>
                    <Component />
                </Box>
               
        </Typography>
    );
}
export default ManagerDashBoard;