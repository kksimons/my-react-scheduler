// Assuming EmployeeLogOut is a button
import React from 'react';
import Scheduler from '@aldabil/react-scheduler';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import SignOut from '@userAuth/services/SignOut';
import EmployeeNavigation from './employeeNavigation';



// This is the components to displayed everything on the employee view, you will import all the component here ! 

const EmployeeDashboard = () => {
    return (
        // <Container>
        //     <Typography variant="h4">This Is Employee Dashboard</Typography>
        //     <Typography variant="subtitle1">Available Page:</Typography>
        //     <Box mt={2}>

        //         <SignOut/>
                
        //     </Box>
        // </Container>

        <Box>
            <EmployeeNavigation />
            <SignOut />
        </Box>

    );
};

export default EmployeeDashboard;
