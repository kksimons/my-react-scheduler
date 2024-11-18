import React from "react";
import { CssBaseline, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from "@theme/theme"; // Assuming theme is defined elsewhere
import { useNavigate } from "react-router-dom";

// EmployeeList component to display all employees
const AllEmployeeList = ({ employees, onDelete, onUpdate, onViewProfile }) => {
  if (employees.length === 0) {
    return <div>No employees found.</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* To apply global background */}
      <div className="employee-list-container">
        <Typography variant="h5" color="primary.dark" gutterBottom>
          All Employees
        </Typography>
        <TableContainer component={Paper}>
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
                <TableRow
                  key={employee.id} // Using employee.id instead of index for better key
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'transparent' : 'rgb(241, 238, 255)', // Alternating background color
                  }}
                >
                  <TableCell>{employee.employee_fname}</TableCell>
                  <TableCell>{employee.employee_lname}</TableCell>
                  <TableCell>{employee.employee_dob}</TableCell>
                  <TableCell>{employee.employee_phone_number}</TableCell>
                  <TableCell>{employee.employee_position}</TableCell>
                  <TableCell>{employee.employee_type}</TableCell>
                  <TableCell>{employee.employee_availability}</TableCell>
                  <TableCell>

                  <Tooltip title="Edit Employee" arrow>
                    <IconButton onClick={() => onUpdate(employee)}>
                      <EditIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Employee" arrow>
                      <IconButton onClick={() => onDelete(employee.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Profile" arrow>
                    <IconButton onClick={() => onViewProfile(employee.id)}>
                      <AccountBoxIcon />
                    </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  );
};

export default AllEmployeeList;
