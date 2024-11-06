// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

import ManagerDashboard from './components/ManagerDashBoard';
import EmployeeDashboard from './components/EmployeeDashBoard';
import ProtectedRoute from './userAuth/contexts/ProtectedRoute';
import SelectRole from './SelectRole';
import { AuthProvider } from './userAuth/contexts/AuthContext';
import { Typography, Box } from '@mui/material';
import EmployerRegistrationPage from './userAuth/EmployerRegistration/EmployerRegistrationPage';
import EmployeeRegistrationPage from './userAuth/EmployeeRegistration/EmployeeRegistrationPage';
import SignUp from './userAuth/services/SignUp';
import SignIn from './userAuth/services/SignIn';
import SignOut from './userAuth/services/SignOut';

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path = "/SignUp" element={<SignUp/>} />
            <Route path="/SignIn" element={<SignIn />} />




            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
              <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
              <Route path="/SelectRole" element={<SelectRole />} />
              <Route path="/EmployerRegistrationPage" element={<EmployerRegistrationPage />} />
              <Route path="/EmployeeRegistrationPage" element={<EmployeeRegistrationPage />} />
              <Route path="/SignOut" element={<SignOut />} />
            </Route>
            
            {/* 404 Not Found Route */}
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
