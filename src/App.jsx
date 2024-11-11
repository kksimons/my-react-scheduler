import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

import EmployerDashboard from '@components/EmployerDashboard';
import EmployeeDashboard from '@components/EmployeeDashboard';
import ProtectedRoute from '@userAuth/contexts/ProtectedRoute';
import SelectRole from './SelectRole';
import AuthProvider from '@userAuth/contexts/AuthContext';
import { Typography, Box } from '@mui/material';
import SignUp from '@userAuth/services/SignUp';
import SignIn from '@userAuth/services/SignIn';
import SignOut from '@userAuth/services/SignOut';
import EmployeeRegistration from '@userAuth/EmployeeRegistration';
import EmployerRegistration from '@userAuth/EmployerRegistration';
import Availability from '@userAuth/Availability';
import ForgotPassword from './userAuth/services/ForgotPassword';

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />

            {/* {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/EmployerDashboard" element={<EmployerDashboard />} />
              <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
              <Route path= "/EmployeeRegistration" element={<EmployeeRegistration />} />
              <Route path="/EmployerRegistration" element={<EmployerRegistration />} />
              <Route path="/SignOut" element={<SignOut />} />
              <Route path="/SelectRole" element={<SelectRole />} />
              <Route path="/Availability" element={<Availability />} />
              
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
