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
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { EmployeeScheduler } from "./Schedules/EmployeeScheduler";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Schedules/Nav-Bar";
dayjs.extend(isBetween);

// EmployeeList component to display all employees
const EmployeeList: React.FC<{ employees: any[] }> = ({ employees }) => {
  if (employees.length === 0) {
    return <div>No employees found.</div>;
  }

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
      <EmployeeScheduler employees={employees} />
    </div>
  );
};

// export const EmployeeScheduler: React.FC<{ employees: any[] }> = ({ employees }) => {
//   const [schedulerData, setSchedulerData] = useState<SchedulerData[]>([]);
//   const [range, setRange] = useState({
//     startDate: new Date(),
//     endDate: new Date(new Date().setDate(new Date().getDate() + 7)) // Default to one week view
//   });

//   useEffect(() => {
//     const convertedData: SchedulerData = employees.map(employee => ({
//       id: employee.id || Math.random().toString(),
//       label: {
//         title: `${employee.employee_fname} ${employee.employee_lname}`,
//         subtitle: employee.employee_position
//       },
//       data: (employee.employee_availability || '').split(', ').map((shift: string) => ({
//         id: `${employee.id}-${shift}`,
//         startDate: getShiftStartTime(shift),
//         endDate: getShiftEndTime(shift),
//         title: shift,
//         subtitle: employee.employee_position,
//         description: `${employee.employee_fname} ${employee.employee_lname}`,
//         bgColor: employee.employee_system === "Dining Side" ? "rgb(254,165,177)" : "rgb(155,220,255)"
//       }))
//     }));

//     setSchedulerData(convertedData);
//   }, [employees]);

//   const getShiftStartTime = (shift: string) => {
//     const today = new Date();
//     switch(shift) {
//       case 'Morning': return new Date(today.setHours(8, 0, 0, 0));
//       case 'Evening': return new Date(today.setHours(16, 0, 0, 0));
//       case 'Closing': return new Date(today.setHours(20, 0, 0, 0));
//       default: return new Date(today.setHours(9, 0, 0, 0));
//     }
//   };

//   const getShiftEndTime = (shift: string) => {
//     const today = new Date();
//     switch(shift) {
//       case 'Morning': return new Date(today.setHours(16, 0, 0, 0));
//       case 'Evening': return new Date(today.setHours(24, 0, 0, 0));
//       case 'Closing': return new Date(today.setHours(28, 0, 0, 0)); // 4 AM next day
//       default: return new Date(today.setHours(17, 0, 0, 0));
//     }
//   };

//   const handleRangeChange = (newRange: { startDate: Date; endDate: Date }) => {
//     setRange(newRange);
//   };

//   const filteredSchedulerData = schedulerData.map(person => ({
//     ...person,
//     data: person.data.filter(
//       (shift) =>
//         dayjs(shift.startDate).isBetween(range.startDate, range.endDate, null, '[]') ||
//         dayjs(shift.endDate).isBetween(range.startDate, range.endDate, null, '[]') ||
//         (dayjs(shift.startDate).isBefore(range.startDate) &&
//          dayjs(shift.endDate).isAfter(range.endDate))
//     )
//   }));

//   return (
//     <Box style={{ height: '500px', marginTop: '20px' }}>
//       <Scheduler
//         data={filteredSchedulerData}
//         onRangeChange={handleRangeChange}
//         onItemClick={(item) => console.log('Clicked item:', item)}
//         onTileClick={(resource) => console.log('Clicked resource:', resource)}
//         config={{
//           zoom: 1, // Show daily view
//           maxRecordsPerPage: 50,
//           lang: 'en',
//           includeTakenHoursOnWeekendsInDayView: true,
//           showTooltip: true
//         }}
//       />
//     </Box>
//   );
// };

// DiningEmployeeList and KitchenEmployeeList defined as above...
const EmployeeManagement: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from Firestore and display it in the table when we call the function
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
      console.log("Fetched employees:", employeeList);
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
  }, []); //fetch employees data in our employee-info db

  //Function to handle to add new employees into state employee
  const handleEmployeeAdded = (newEmployee: any) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    fetchEmployees();
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  //Render loading or error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="employee-management-container" style={{padding: '20px'}}>
      <div>
      <NavBar tabIndex={tabIndex} handleTabChange={handleTabChange} />

      </div>
      <Box style={{ marginTop: "5px" }}>
        {tabIndex === 0 && <EmployeeList employees={employees} />}
        {tabIndex === 1 && <DiningEmployeeList employees={employees.filter((emp) => emp.employee_system === "Dining Side")} />}
        {tabIndex === 2 && <KitchenEmployeeList employees={employees.filter((emp) => emp.employee_system === "Kitchen Side")} />}
        {tabIndex === 3 && <AddEmployee onEmployeeAdded={handleEmployeeAdded} />}
        {tabIndex === 4 && <EmployeeScheduler employees={employees} />}

    </Box>
    </div>
    
  );
};

export default EmployeeManagement;
