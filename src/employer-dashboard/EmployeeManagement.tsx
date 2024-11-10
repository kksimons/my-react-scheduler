import React, { useState, useEffect } from "react";
import { db } from "../userAuth/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import AllEmployeeList from "./AllEmployeeList";
import { Box, Button, Fab, styled, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddEmployee from "./AddEmployee";
import EmployeeScheduler from "./EmployeeScheduler";
// import EmployeeScheduler from "./EmployeeScheduler";

const themeColors = {
  primary: '#8a2be2',     // Purple color for buttons and accents
  secondary: '#9b30ff',   // Lighter purple for hover effects
  tertiary: '#ffffff',    // White for text and highlights
};

const ContentText = styled(Typography)({
  color: themeColors.tertiary,
  fontWeight: 400,
  fontSize: '23px',
  marginBottom: '3rem',
  backgroundColor: 'rgba(85, 66, 253, 0.5)',
  borderRadius: '1rem',
  padding: '3rem 2rem',
  boxSizing: 'border-box',
});

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  // Fetch employees from Firestore
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle Delete Employee
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  // Handle Add Employee
  const handleAddEmployee = (newEmployee: any) => {
    setEmployees([...employees, newEmployee]);
    setShowAddEmployee(false); // Hide the AddEmployee component after adding
  };

  // Handle Update Employee
  const handleUpdateEmployee = (employeeToUpdate: any) => {
    setEditEmployee(employeeToUpdate);
    setShowAddEmployee(true);
  };

  // Handle Employee After Update
  const handleEmployeeUpdated = (updatedEmployee: any) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setEditEmployee(null);
    setShowAddEmployee(false);
  };


  return (
    <Box
    sx={{
      height: '100%',
      maxWidth: '1200px',
      width: '100%',
      padding: '2rem',
    }}
  >
    {showAddEmployee ? (
      <AddEmployee
        onEmployeeAdded={handleAddEmployee}
        initialData={editEmployee}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    ) 
    : showScheduler ? (
      <EmployeeScheduler employees={employees} />
    ) 
    : (
      <AllEmployeeList
        employees={employees}
        onDelete={handleDelete}
        onUpdate={handleUpdateEmployee}
      />
    )}
    {!showAddEmployee && !showScheduler ? (
      <>
        <Fab
          color="primary"
          aria-label="schedule"
          style={{
            position: "fixed",
            bottom: "7rem",
            right: "2rem",
          }}
          onClick={() => setShowScheduler(true)}
        >
          <DateRangeIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
          }}
          onClick={() => {
            setEditEmployee(null);
            setShowAddEmployee(true);
          }}
        >
          <AddIcon />
        </Fab>
      </>
    ) : (
      <Fab
        color="primary"
        aria-label="back"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        onClick={() => {
          setShowScheduler(false);
          setShowAddEmployee(false);
          setEditEmployee(null);
        }}
      >
        <ArrowBackIcon />
      </Fab>
    )}
  </Box>
  );
};

export default EmployeeManagement;
