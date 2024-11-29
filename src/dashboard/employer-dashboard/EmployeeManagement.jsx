import React, { useState } from "react";
import { db } from "@userAuth/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import AllEmployeeList from "./AllEmployeeList";
import { Box } from "@mui/material";
import AddEmployee from "./AddEmployee";
import EmployeeScheduler from "./EmployeeScheduler";

const EmployeeManagement = ({ employees, setEmployees, defaultView = 'list', navigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle Delete Employee
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  // Handle Add Employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setIsAddEmployeeOpen(true);
  };

  // Handle Update Employee
  const handleUpdateEmployee = (employeeToUpdate) => {
    setEditEmployee(employeeToUpdate);
    setIsAddEmployeeOpen(true);
  };

  // Handle Employee After Update
  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setEditEmployee(null);
    setIsAddEmployeeOpen(false);
  };

  return (
    <Box
    className="employee-management-container"
    sx={{ padding: "10px", position: "relative", minHeight: "100vh" }}
  >
    {defaultView === 'addEmployee' || editEmployee ? (
      <AddEmployee
        onEmployeeAdded={handleAddEmployee}
        initialData={editEmployee}
        onEmployeeUpdated={handleEmployeeUpdated}
        navigate={navigate}
      />
    ) : defaultView === 'scheduler' ? (
      <EmployeeScheduler employees={employees} />
    ) : (
      <AllEmployeeList
        employees={employees}
        onDelete={handleDelete}
        onUpdate={handleUpdateEmployee}
        onViewProfile={(employeeId) => navigate(`/employeeManagement/employeeProfile/${employeeId}`)}
      />
    )}
  </Box>
  );
};

export default EmployeeManagement;