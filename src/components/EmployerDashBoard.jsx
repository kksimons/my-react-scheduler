
import React from 'react';
import {  Typography, Box } from '@mui/material'; // Could remove the Typography here
import SignOut from '@userAuth/services/SignOut';
import DashboardLayoutBasic from '@schedules/Dashboard';


// {Old version}
// const EmployerDashBoard = () => { 
//     return (
        
//         <Box>

//             <Typography> 
//                 {/* Admin DashBoard:  */}

//                 <SignOut />
                
               
//         </Typography>
//             <DashboardLayoutBasic />
//         </Box>
//     );
// }
// export default EmployerDashBoard;

const EmployerDashBoard = () => {
    return (
        
        <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflowX: 'hidden' }}> {/* Prevent horizontal overflow */}

      {/* SignOut Button positioned at the top-right */}
      <Box sx={{ position: 'absolute', top: 10, right: 16 }}>
        <SignOut />
      </Box>

        {/* Title Section: Horizontally Centered */}
      <Box sx={{
        textAlign: 'center', 
        marginTop: 1, 
        width: '100%', 
      }}>
        <Typography 
          variant="h4" e
          sx={{
            fontWeight: 'bold', 
            color: '#333', 
            textTransform: 'uppercase', // Makes the title uppercase for emphasis
            letterSpacing: 1.5, // Adds some space between the letters
            whiteSpace: 'nowrap', // Prevents text wrapping
            overflow: 'hidden', // Ensures content does not overflow horizontally
            textOverflow: 'ellipsis', // Handles overflow if the text is too long
          }}
        >
          <span style={{ fontSize: '3rem', color: '#1976d2', fontWeight: 'bold' }}>
          P
        </span>
        ower
        <span style={{ fontSize: '3rem', color: '#1976d2', fontWeight: 'bold' }}>
        S
        </span>
        hift
        </Typography>
      </Box>

      {/* Main Dashboard Layout */}
      <DashboardLayoutBasic />
      
    </Box>
  );
};

export default EmployerDashBoard;