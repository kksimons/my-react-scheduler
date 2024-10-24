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
import { Box, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddEmployee from "./AddEmployee";
import EmployeeScheduler from "./EmployeeScheduler";

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
      const employeeCollection = collection(db, "employee-info");
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
      await deleteDoc(doc(db, "employee-info", id));
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

  // Convert employees data to Scheduler format
  const schedulerData = employees.map((emp) => ({
    id: emp.id,
    title: `${emp.employee_fname} ${emp.employee_lname}`,
    startDate: new Date(),
    endDate: new Date(),
  }));

  return (
    <div
      className="employee-management-container"
      style={{ padding: "10px", position: "relative", minHeight: "100vh" }}
    >
      <h1>Employee Management</h1>
      {showAddEmployee ? (
        <AddEmployee
          onEmployeeAdded={handleAddEmployee}
          initialData={editEmployee}
          onEmployeeUpdated={handleEmployeeUpdated}
        />
      ) 
      // : showScheduler ? (
      //   <EmployeeScheduler employees={employees} />
      // ) 
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
    </div>
  );
};

export default EmployeeManagement;
