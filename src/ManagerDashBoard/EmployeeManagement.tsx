// THIS PAGE WILL DO: 
// 1. This page will display employee lists (All, Dining, Kitchen, Add Employee). Each tab will display employees base on their employee_system (kitchen or dining) 
// 2. It will auto update new employee 
// 3. 



import React, { useState, useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { db } from "../userAuth/firebase";
import { collection, getDocs } from "firebase/firestore";
import AddEmployee from "./AddEmployee";
// import "./EmployeeManagement.css";
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
          {/* Display employee by employee */}
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

  // Fetch employees from Firestore and display it in the table when we call the function 
  const fetchEmployees = async () => {
    try {

      const employeeCollection = collection(db, "employee-info"); //employee-info = our database name
      const employeeSnapshot = await getDocs(employeeCollection); //get doc of our emp database 
      const employeeList = employeeSnapshot.docs.map((doc) => doc.data()); //get each emp info 
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); //fetch employees data in our employee-info db 

  //Function to handle to add new employees into state employee 
  const handleEmployeeAdded = (newEmployee: any) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };


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
      {/* The first one has only {employees because it's fetch emp without any filter, so it will show all emp we have} */}
      {tabIndex === 0 && <EmployeeList employees={employees} />} 

      
      {/* Dining employee tab, add filter */}
      {tabIndex === 1 && <DiningEmployeeList employees={employees.filter(emp => emp.employee_system === "Dining Side")} />}

      {/* Kitchen employee tab, add filter */}
      {tabIndex === 2 && <KitchenEmployeeList employees={employees.filter(emp => emp.employee_system === "Kitchen Side")} />}

      {/* Add employee tab */}
      {tabIndex === 3 && (
        <AddEmployee
          onEmployeeAdded={() => {
            fetchEmployees(); 
          }}
        />
      )}
    </Box>
  );
};

export default EmployeeManagement;


