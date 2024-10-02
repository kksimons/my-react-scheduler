import React, { useState, useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { db } from "../userAuth/firebase";
import { collection, getDocs } from "firebase/firestore";
import AddEmployee from "./AddEmployee";
import "./EmployeeManagement.css";
import DiningEmployeeList from "./DiningEmployeeList";
import KitchenEmployeeList from "./KitchenEmployeeList";

// EmployeeList component to display all employees
const EmployeeList: React.FC<{ employees: any[] }> = ({ employees }) => {
  return (
    <div className="employee-list-container">
      <h1>All Employees</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Employee Type</th>
            <th>Available Shifts</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employee_fname}</td>
              <td>{employee.employee_lname}</td>
              <td>{employee.employee_dob}</td>
              <td>{employee.employee_phone_number}</td>
              <td>{employee.employee_position}</td>
              <td>{employee.employee_type}</td>
              <td>{employee.employee_availability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// DiningEmployeeList and KitchenEmployeeList defined as above...

const EmployeeManagement: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [employees, setEmployees] = useState<any[]>([]);

  // Fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeeCollection = collection(db, "employee-info");
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map((doc) => doc.data());
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box className="employee-management-container">
      {/* Tabs for navigation */}
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="All Employee" />
        <Tab label="Dining Employee" />
        <Tab label="Kitchen Employee" />
        <Tab label="Add Employee" />
      </Tabs>

      {/* Tab content */}
      {tabIndex === 0 && <EmployeeList employees={employees} />}

      {/* Dining employee tab */}
      {tabIndex === 1 && <DiningEmployeeList employees={employees} />}

      {/* Kitchen employee tab */}
      {tabIndex === 2 && <KitchenEmployeeList employees={employees} />}

      {/* Add employee tab */}
      {tabIndex === 3 && (
        <AddEmployee
          onEmployeeAdded={() => {
            fetchEmployees(); // Refresh the employee list after adding a new employee
          }}
        />
      )}
    </Box>
  );
};

export default EmployeeManagement;
