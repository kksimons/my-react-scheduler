// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ManagerSignUpPage from './userAuth/ManagerSignUp/ManagerSignUpPage';
import ManagerSignInPage from './userAuth/ManagerSignIn/ManagerSignInPage';
import ManagerDashboard from './components/ManagerDashBoard';
import EmployeeSignUpPage from './userAuth/EmployeeSignUp/EmployeeSignUpPage';
import EmployeeSignInPage from './userAuth/EmployeeSignIn/EmployeeSignInPage';
import EmployeeDashboard from './components/EmployeeDashBoard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './userAuth/contexts/AuthContext';
import { Typography, Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/ManagerSignUpPage" element={<ManagerSignUpPage />} />
          <Route path="/ManagerSignInPage" element={<ManagerSignInPage />} />
          <Route path="/EmployeeSignUpPage" element={<EmployeeSignUpPage />} />
          <Route path="/EmployeeSignInPage" element={<EmployeeSignInPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
            <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          </Route>
          
          {/* 404 Not Found Route */}
          <Route path="*" element={
            <Box sx={{ padding: '50px', textAlign: 'center' }}>
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
