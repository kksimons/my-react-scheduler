import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import NAVIGATION from "./employerNavigation";
import theme from "@theme/theme";
import EmployeeManagement from "./EmployeeManagement";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../userAuth/firebase";
import logo from "../assets/logo.png";
import EmployeeScheduler from "./EmployeeScheduler";
import AddEmployee from "./AddEmployee";
import AllEmployeeList from "./AllEmployeeList";

const EmployerDashboardLayout = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const employeeCollection = collection(db, "employees");
        const employeeSnapshot = await getDocs(employeeCollection);
        const employeeList = employeeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to fetch employees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleNavigation = (path) => {
    console.log("Navigating to: ", path);
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img src={logo} alt="PowerShifts logo" />,
          title: "",
        }}
        onNavigate={handleNavigation}
      >
        <ToolpadDashboardLayout>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <Routes>
              <Route path="/" element={<EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="scheduler" />} />
              <Route path="/AddEmployee" element={<EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="addEmployee" />} />
              <Route path="/AllEmployeeList" element={<AllEmployeeList employees={employees} defaultView="list" />} />
              <Route path="/contactList" element={<div>Contact List Page</div>} />
            </Routes>
          )}
        </ToolpadDashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
};

export default EmployerDashboardLayout;