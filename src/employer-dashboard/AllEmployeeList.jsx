import { CssBaseline, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React from "react"
// import CustomEvent from "./CustomeEvent";
import theme from "../theme/theme";

// EmployeeList component to display all employees
const AllEmployeeList = ({ employees, onDelete, onUpdate }) => {
    if (employees.length === 0) {
      return <div>No employees found.</div>;
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* To apply global background */}
            <div className="employee-list-container">
            <Typography variant="h6" color="primary.dark" gutterBottom>All Employees</Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Employee Type</TableCell>
                            <TableCell>Available Shifts</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.employee_fname}</TableCell>
                                <TableCell>{employee.employee_lname}</TableCell>
                                <TableCell>{employee.employee_dob}</TableCell>
                                <TableCell>{employee.employee_phone_number}</TableCell>
                                <TableCell>{employee.employee_position}</TableCell>
                                <TableCell>{employee.employee_type}</TableCell>
                                <TableCell>{employee.employee_availability}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onUpdate(employee)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(employee.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ) )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <EmployeeScheduler employees={employees} /> */}
            </div>
        </ThemeProvider>
      );
    }

export default AllEmployeeList;