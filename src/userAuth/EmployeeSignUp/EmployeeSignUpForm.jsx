import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SignUpEmployee from '../services/SignUpEmployee';

const EmployeeSignUpForm = () => {
  const [formData, setFormData] = useState({
    employeeFirstName: '',
    employeeLastName: '',
    employeeDob: '',
    employeeGender: '',
    employeePhoneNumber: '',
    employeeEmail: '',
    employeePassword: '',
    employeeAvailability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    },
    employeeType: '',
    employeePositions: []
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAvailabilityChange = (day, shift) => {
    setFormData((prevState) => ({
      ...prevState,
      employeeAvailability: {
        ...prevState.employeeAvailability,
        [day]: prevState.employeeAvailability[day].includes(shift)
          ? prevState.employeeAvailability[day].filter((s) => s !== shift)
          : [...prevState.employeeAvailability[day], shift]
      }
    }));
  };

  const handlePositionChange = (position) => {
    setFormData((prevState) => ({
      ...prevState,
      employeePositions: prevState.employeePositions.includes(position)
        ? prevState.employeePositions.filter((p) => p !== position)
        : [...prevState.employeePositions, position]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { employeeFirstName, employeeLastName, employeeDob, employeeGender, employeePhoneNumber, employeeEmail, employeePassword, employeeType, employeePositions, employeeAvailability } = formData;

    // Debugging: Log form data
    console.log("Form Data:", formData);

    try {
      await SignUpEmployee({
        employeeFirstName,
        employeeLastName,
        employeeDob,
        employeeGender,
        employeePhoneNumber,
        employeeEmail,
        employeeType,
        employeePositions,
        employeeAvailability
      }, employeePassword);
      console.log("Employee signed up successfully.");
      navigate('/EmployeeDashBoard');
    } catch (error) {
      console.log('Error signing up employee. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            name="employeeFirstName"
            value={formData.employeeFirstName}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="employeeLastName"
            value={formData.employeeLastName}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date of Birth"
            type="date"
            name="employeeDob"
            value={formData.employeeDob}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="employeeGender"
              value={formData.employeeGender}
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            type="tel"
            name="employeePhoneNumber"
            value={formData.employeePhoneNumber}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            name="employeeEmail"
            value={formData.employeeEmail}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            name="employeePassword"
            value={formData.employeePassword}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Availability</FormLabel>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
            <Box key={day} mb={1}>
              <Typography>{day.charAt(0).toUpperCase() + day.slice(1)}:</Typography>
              <FormGroup row>
                {['morning', 'opening', 'closing'].map((shift) => (
                  <FormControlLabel
                    key={shift}
                    control={
                      <Checkbox
                        checked={formData.employeeAvailability[day].includes(shift)}
                        onChange={() => handleAvailabilityChange(day, shift)}
                      />
                    }
                    label={shift.charAt(0).toUpperCase() + shift.slice(1)}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Employee Type</InputLabel>
            <Select
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Position</FormLabel>
          <FormGroup row>
            {['server', 'busser', 'host'].map((position) => (
              <FormControlLabel
                key={position}
                control={
                  <Checkbox
                    checked={formData.employeePositions.includes(position)}
                    onChange={() => handlePositionChange(position)}
                  />
                }
                label={position.charAt(0).toUpperCase() + position.slice(1)}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeSignUpForm;