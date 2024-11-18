import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from '@theme/theme'; // Ensure the theme is properly imported

const EmployeeCardView = ({ employees, onViewProfile }) => {
  return (
    <Grid container spacing={2}>
      {employees.map((employee) => (
        <Grid item xs={12} sm={6} md={4} key={employee.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" flexDirection="column">
                <Avatar
                  src={employee.photoURL || '/default-avatar.png'} // Adjust the path as needed
                  alt={`${employee.employee_fname} ${employee.employee_lname}`}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h6">
                  {employee.employee_fname} {employee.employee_lname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {employee.employee_position}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Date of Birth:</strong> {employee.employee_dob}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone Number:</strong> {employee.employee_phone_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Employee Type:</strong> {employee.employee_type}
                </Typography>
                <Typography variant="body2">
                  <strong>Available Shifts:</strong> {employee.employee_availability}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Tooltip title="View Profile" arrow>
                <IconButton onClick={() => onViewProfile(employee.id)}>
                  <AccountBoxIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EmployeeCardView;
