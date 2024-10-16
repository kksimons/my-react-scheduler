

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { ManagerViewScheduler } from '../schedules/ManagerViewScheduler';
const ManagerDashBoard: React.FC = () => { 
    return (
        <Typography> 
            This Is Employee DashBoard: 
                Available Page: 
                <Box>
                    <ManagerViewScheduler />
                </Box>
               
        </Typography>
    );
}
export default ManagerDashBoard;