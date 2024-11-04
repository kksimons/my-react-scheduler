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
import { navigate, Link, RouterLink, Router } from 'react-router-dom';
import SignUpEmployee from '../services/SignUpEmployee';

const EmployeeSignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    email: '',
    password: '',
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    },
    employeeType: '',
    positions: []
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
      availability: {
        ...prevState.availability,
        [day]: prevState.availability[day].includes(shift)
          ? prevState.availability[day].filter((s) => s !== shift)
          : [...prevState.availability[day], shift]
      }
    }));
  };

  const handlePositionChange = (position) => {
    setFormData((prevState) => ({
      ...prevState,
      positions: prevState.positions.includes(position)
        ? prevState.positions.filter((p) => p !== position)
        : [...prevState.positions, position]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, dob, gender, phoneNumber, email, password, employeeType, positions, availability } = formData;

    try {
      await SignUpEmployee({
        firstName,
        lastName,
        dob,
        gender,
        phoneNumber,
        email,
        employeeType,
        positions,
        availability
      }, password);
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
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
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
              name="gender"
              value={formData.gender}
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
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
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
                        checked={formData.availability[day].includes(shift)}
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
                    checked={formData.positions.includes(position)}
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