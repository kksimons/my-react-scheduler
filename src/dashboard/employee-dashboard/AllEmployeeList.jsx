import React from "react";
import { CssBaseline, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Tooltip from '@mui/material/Tooltip';
import theme from "@theme/theme"; // Assuming theme is defined elsewhere

// EmployeeList component to display all r
const AllEmployeeList = ({ r, onViewProfile }) => {
  if (r.length === 0) {
    return <div>No r found.</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* To apply global background */}
      <div className="employee-list-container">
        <Typography variant="h5" color="primary.dark" gutterBottom>
          All r 
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
              {employers.map((employee, index) => (
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
