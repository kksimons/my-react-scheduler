import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React from "react"

interface EmployeeListProps {
    employees: any[];
    onDelete: (id: string) => void;
    onUpdate: (id: string) => void;
}

// EmployeeList component to display all employees
const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onDelete, onUpdate }) => {
    if (employees.length === 0) {
      return <div>No employees found.</div>;
    }
    return (
        <div className="employee-list-container">
          <h1>All Employees</h1>
          <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Employee Type</TableCell>
                        <TableCell>Available Shifts</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employees, index) => (
                        <TableRow key={index}>
                            <TableCell>{employees.employee_fname}</TableCell>
                            <TableCell>{employees.employee_lname}</TableCell>
                            <TableCell>{employees.employee_dob}</TableCell>
                            <TableCell>{employees.employee_phone_number}</TableCell>
                            <TableCell>{employees.employee_position}</TableCell>
                            <TableCell>{employees.employee_type}</TableCell>
                            <TableCell>{employees.employee_availability}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onUpdate(employees)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(employees.id)}>
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
      );
    }

export default EmployeeList;