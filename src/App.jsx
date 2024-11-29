import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './LandingPage';

import EmployerDashboard from '@dashboard/employer-dashboard/EmployerDashboard';
import EmployeeDashboard from '@dashboard/employee-dashboard/EmployeeDashboard';
import ProtectedRoute from '@userAuth/contexts/ProtectedRoute';
import SelectRole from '@userAuth/SelectRole';
import AuthProvider from '@userAuth/contexts/AuthContext';
import { Typography, Box } from '@mui/material';
import SignUp from '@userAuth/services/SignUp';
import SignIn from '@userAuth/services/SignIn';
import SignOut from '@userAuth/services/SignOut';
import EmployeeRegistration from '@userAuth/EmployeeRegistration';
import EmployerRegistration from '@userAuth/EmployerRegistration';
import Availability from '@userAuth/Availability';
import ForgotPassword from '@userAuth/services/ForgotPassword';
import PricingPage from './PricingPage';


import UserProfile from '@dashboard/components/UserProfile';
import EmployerNavigation from './dashboard/employer-dashboard/employerNavigation';
import AddEmployee from '@dashboard/employer-dashboard/AddEmployee';
import EmployeeScheduler from '@dashboard/employee-dashboard/EmployeeScheduler';
import EmployeeManagement from '@dashboard/employer-dashboard/EmployeeManagement';
import AllEmployeeList from '@dashboard/employer-dashboard/AllEmployeeList';
import AutoGenerateSchedule from './dashboard/employer-dashboard/AutoGenerateSchedule';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ClassesPage from "./classesPage/ClassesPage";


import './App.css';


const App = () => {
  return (
      <AuthProvider>
        <Router>
          {/* Global ToastContainer */}
          {/* I implement the toast component here to make sure it is accessibile in all other pages without import the it over again */}
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/PricingPage" element={<PricingPage />} />

            {/* Route for ClassesPage */}
            <Route path="/classes" element={<ClassesPage />} />

            {/* {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/EmployerDashboard" element={<EmployerDashboard />} />
              <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
              <Route path="/EmployeeRegistration" element={<EmployeeRegistration />} />
              <Route path="/EmployerRegistration" element={<EmployerRegistration />} />
              <Route path="/SignOut" element={<SignOut />} />
              <Route path="/SelectRole" element={<SelectRole />} />
              <Route path="/Availability" element={<Availability />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} /> 
              <Route path= "/UserProfile" element={<UserProfile />} />
             
              
              
            {/* Routing for employer dashboard*/} 
              <Route path="/EmployerDashboard" element={<EmployerDashboard />} />
              <Route path="/AddEmployee" element={<AddEmployee />} />
              <Route path="/EmployeeScheduler" element={<EmployeeScheduler />} />
              <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
              <Route path="/AllEmployeeList" element={<AllEmployeeList />} />
              <Route path="/AutoGenerateSchedule" element={<AutoGenerateSchedule />} />
              <Route path="/employerNavigation" element={<EmployerNavigation />} />
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
