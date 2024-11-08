import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

import ManagerDashboard from '@components/ManagerDashBoard';
import EmployeeDashboard from '@components/EmployeeDashBoard';
import ProtectedRoute from '@userAuth/contexts/ProtectedRoute';
import SelectRole from './SelectRole';
import AuthProvider from '@userAuth/contexts/AuthContext';
import { Typography, Box } from '@mui/material';
import SignUp from '@userAuth/services/SignUp';
import SignIn from '@userAuth/services/SignIn';
import SignOut from '@userAuth/services/SignOut';
import EmployeeRegistration from '@userAuth/EmployeeRegistration';
import EmployerRegistration from '@userAuth/EmployerRegistration';
// import EmployeeRegistration from '@userAuth/EmployeeRegistration/EmployeeRegistration';
import BussersSchedule from '@schedules/BussersSchedule';

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />

            {/* {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
              <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
              <Route path= "/EmployeeRegistration" element={<EmployeeRegistration />} />
              <Route path="/EmployerRegistration" element={<EmployerRegistration />} />
              <Route path="/SignOut" element={<SignOut />} />
              <Route path="/SelectRole" element={<SelectRole />} />
              <Route path="/BussersSchedule" element={<BussersSchedule />} />
            </Route>
            
            {/* {/* 404 Not Found Route */}
            <Route path="*" element={
              <Box>
                <Typography variant="h4">404 - Page Not Found</Typography>
                <Typography variant="body1">
                  The page you are looking for does not exist.
                </Typography>
              </Box>
            } />
          </Routes>
        </Router>
      </AuthProvider>
  );
};

export default App;
