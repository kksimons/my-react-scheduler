import { Box, CssBaseline, IconButton, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React from "react"
import CustomTheme from "../customtheme";

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
        <Box
        sx={{
        //   background: 'linear-gradient(97deg, rgba(233,104,255,1) 0%, rgba(69,91,235,1) 37%, rgba(34,24,167,1) 79%)',
          justifyContent: 'center',
          width: 'full',
          alignItems: 'center',
        //   height: '100vh',
        }}
      >
            {/* <CssBaseline /> To apply global background */}
            <div className="employee-list-container">
            <Typography>All Employees</Typography>
            <ContentText >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#9b30ff', border: 'rounded'}}>
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
            </ContentText>

            {/* <EmployeeScheduler employees={employees} /> */}
            </div>
        </Box>
      );
    }

export default EmployeeList;