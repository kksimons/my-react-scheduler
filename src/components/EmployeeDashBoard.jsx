// Assuming EmployeeLogOut is a button
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import SignOut from '../userAuth/services/SignOut';




const EmployeeDashboard = () => {
    return (
        <Container>
            <Typography variant="h4">This Is Employee Dashboard</Typography>
            <Typography variant="subtitle1">Available Page:</Typography>
            <Box mt={2}>

                <SignOut/>
                
            </Box>
        </Container>
    );
};

export default EmployeeDashboard;
