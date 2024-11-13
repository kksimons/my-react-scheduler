// DashboardLayout.jsx

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout as ToolpadDashboardLayout } from '@toolpad/core/DashboardLayout';
import NAVIGATION from './employerNavigation'; 
import theme from '@theme/theme';
import AddEmployee from './AddEmployee';


//This component is the layout for employer dashboard including (Navigation side bar, and Routes for other pages )
const EmployerDashboardLayout = () => {
  return (
    // <ThemeProvider theme={theme}>
      <AppProvider
       navigation={NAVIGATION}
       branding={{
         logo: <img src="https://mui.com/static/logo.png" alt="PowerShifts logo" />,
         title: 'PowerShift',
       }}
       >
        <ToolpadDashboardLayout 
        >
          <Routes>
            {/* Define your routes here */}
            <Route path="/AddEmployee" element={<AddEmployee />} />

          </Routes>
        </ToolpadDashboardLayout>
      </AppProvider>
    // </ThemeProvider>
  );
};

export default EmployerDashboardLayout;
