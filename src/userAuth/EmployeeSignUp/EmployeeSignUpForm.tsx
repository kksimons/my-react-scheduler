import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { SignUpEmployee } from '../services/SignUpEmployee'; 
import { EmployeeData } from '../../components/EmployeeData'; 

export function EmployeeSignUpForm() {
  // State for form inputs
  const [employeeFname, setEmployeeFname] = useState('');
  const [employeeLname, setEmployeeLname] = useState('');
  const [employeeDob, setEmployeeDob] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [employeePosition, setEmployeePosition] = useState('');
  const [employeeSystem, setEmployeeSystem] = useState('');
  const [employeeAvailability, setEmployeeAvailability] = useState({


  });

  // State for handling errors
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    // Employee data to be submitted
    const employeeData: EmployeeData = {
      employeeFname,
      employeeLname,
      employeeDob,
      employeePhone,
      employeeEmail,
      employeeType,
      employeePosition,
      employeeSystem,
      employeeAvailability,
    };

    try {
      // Call sign-up function
      await SignUpEmployee(employeeData, employeePassword);
      console.log('Employee signed up successfully!');
      // Reset form or redirect as needed
    } catch (error) {
      setFormError('Error during sign-up. Please try again.');
      console.error('Error signing up employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
      <Typography component="h1" variant="h5">
        Employee Sign Up
      </Typography>

      {/* First Name */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeFname">First Name</FormLabel>
        <TextField
          id="employeeFname"
          name="employeeFname"
          required
          fullWidth
          variant="outlined"
          value={employeeFname}
          onChange={(e) => setEmployeeFname(e.target.value)}
        />
      </FormControl>

      {/* Last Name */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeLname">Last Name</FormLabel>
        <TextField
          id="employeeLname"
          name="employeeLname"
          required
          fullWidth
          variant="outlined"
          value={employeeLname}
          onChange={(e) => setEmployeeLname(e.target.value)}
        />
      </FormControl>

      {/* Date of Birth */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeDob">Date of Birth</FormLabel>
        <TextField
          id="employeeDob"
          name="employeeDob"
          type="date"
          required
          fullWidth
          variant="outlined"
          value={employeeDob}
          onChange={(e) => setEmployeeDob(e.target.value)}
        />
      </FormControl>

      {/* Phone Number */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeePhone">Phone Number</FormLabel>
        <TextField
          id="employeePhone"
          name="employeePhone"
          required
          fullWidth
          variant="outlined"
          value={employeePhone}
          onChange={(e) => setEmployeePhone(e.target.value)}
        />
      </FormControl>

      {/* Email */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeEmail">Email</FormLabel>
        <TextField
          id="employeeEmail"
          name="employeeEmail"
          type="email"
          required
          fullWidth
          variant="outlined"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeePassword">Password</FormLabel>
        <TextField
          id="employeePassword"
          name="employeePassword"
          type="password"
          required
          fullWidth
          variant="outlined"
          value={employeePassword}
          onChange={(e) => setEmployeePassword(e.target.value)}
        />
      </FormControl>

      {/* Employment Type */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeType">Employment Type</FormLabel>
        <TextField
          id="employeeType"
          name="employeeType"
          required
          fullWidth
          variant="outlined"
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
        />
      </FormControl>

      {/* Position */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeePosition">Position</FormLabel>
        <TextField
          id="employeePosition"
          name="employeePosition"
          required
          fullWidth
          variant="outlined"
          value={employeePosition}
          onChange={(e) => setEmployeePosition(e.target.value)}
        />
      </FormControl>

      {/* System (e.g., Kitchen Side, Dining Side) */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeSystem">System</FormLabel>
        <TextField
          id="employeeSystem"
          name="employeeSystem"
          required
          fullWidth
          variant="outlined"
          value={employeeSystem}
          onChange={(e) => setEmployeeSystem(e.target.value)}
        />
      </FormControl>

      {/* Availability */}
      <FormControl fullWidth>
        <FormLabel htmlFor="employeeAvailability">Availability (Example: Monday: 09:00 - 17:00)</FormLabel>
        {/* You can later enhance this field to have a more complex availability input */}
        <TextField
          id="employeeAvailability"
          name="employeeAvailability"
          required
          fullWidth
          variant="outlined"
          value={JSON.stringify(employeeAvailability)} // Display as JSON for now
          onChange={(e) => setEmployeeAvailability(JSON.parse(e.target.value))}
        />
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        sx={{ backgroundColor: '#5201C3', '&:hover': { backgroundColor: '#6200ea' } }}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>

      {/* Display form errors */}
      {formError && (
        <Typography color="error" variant="body2">
          {formError}
        </Typography>
      )}
    </Box>
  );
}

export default EmployeeSignUpForm;