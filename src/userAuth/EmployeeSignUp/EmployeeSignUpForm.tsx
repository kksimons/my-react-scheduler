// // src/userAuth/EmployeeSignUp/EmployeeSignUpForm.tsx

// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { useNavigate, Link as RouterLink  } from 'react-router-dom';
// import { SignUpEmployee } from '../../userAuth/services/SignUpEmployee';

// //-----------MUI STYLING IMPORT HERE -------------------------------------------------
// import { TextField, Button, Typography, Box, FormControl, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, Link, SelectChangeEvent, } from '@mui/material';
// //------------------------------------------------------------------------------------------


// //Define data type cuz u r using Typescript so u have to do it 
// interface EmployeeData {
//   employeeFname: string;
//   employeeLname: string;
//   employeeDob: string;
//   employeePhone: string;
//   employeeEmail: string;
//   employeeType: string;
//   employeePosition: string;
//   employeeSystem: string;
//   employeeAvailability: {
//     [key: string]: string[];
//   };
// }

// //define data type for employee state 
// interface EmployeeFormState {
//   employeeFname: string;
//   employeeLname: string;
//   employeeDob: string;
//   employeePhone: string;
//   employeeEmail: string;
//   employeePassword: string;
//   employeeType: string;
//   employeePosition: string;
//   employeeSystem: string;
// }

// //Employee Sign Up Form starts here 
// const EmployeeSignUpForm: React.FC = () => {
//   const [employee, setEmployee] = useState<EmployeeFormState>({
//     employeeFname: '', //Emp first name 
//     employeeLname: '', //Emp last name
//     employeeDob: '', //emp dob 
//     employeePhone: '', //emp phone 
//     employeeEmail: '', //emp email 
//     employeePassword: '', //emp password 
//     employeeType: '', // Part-Time or Full-Time
//     employeePosition: '', // Dining: Server, Busser, Host || Kitchen Side: Cook 
//     employeeSystem: '' // Dining Side or Kitchen Side
//   });

//   //Set const for Availability State. Those will be string from Monday to Sunday 
//   const [availability, setAvailability] = useState<Record<string, string[]>>({
//     Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
//   });

//   //Submit State 
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState('');
  
//   //Set Navigation, so when user sign up successfully, it will direct employee to EmployeeDashBoard.tsx 
//   const navigate = useNavigate(); 

//   // Handle input changes for TextField components
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setEmployee({ ...employee, [e.target.name]: e.target.value });
//   };


//   // Handle availability checkbox changes
//   //day = mon -> sun 
//   // time = morning, evening, closing, off 
//   const handleAvailabilityChange = (day: string, time: string) => {
//     setAvailability(prev => ({
//       ...prev,
//       [day]: prev[day].includes(time) ? prev[day].filter(eachTime => eachTime !== time) : [...prev[day], time]
//     }));
//   };

//   // Handle Employee Type selection (Part-Time or Full-Time)
//   const handleTypeChange = (event: SelectChangeEvent<string>) => {
//     setEmployee(prev => ({
//       ...prev,
//       employeeType: event.target.value as string
//     }));
//   };

//   // Handle System Side selection (Dining Side or Kitchen Side)
//   const handleSystemChange = (event: SelectChangeEvent<string>) => {
//     const system = event.target.value as string;
//     setEmployee(prev => ({
//       ...prev,
//       employeeSystem: system, //If system = 'Kitchen Side' 
//       employeePosition: system === 'Kitchen Side' ? 'Cook' : '' // Automatically set position as "Cook" if Kitchen Side
//     }));
//   };

//   // Handle Position selection based on System Side
//   const handlePositionChange = (event: SelectChangeEvent<string>) => {
//     setEmployee(prev => ({
//       ...prev,
//       employeePosition: event.target.value as string
//     }));
//   };

//   //SUBMISSION PART -------------------------------------------------------------------
//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
  
//     const fullEmployeeData: EmployeeData = {
//       ...employee,
//       employeeAvailability: availability, 
//     };
  
//     try {
//       await SignUpEmployee(fullEmployeeData, employee.employeePassword);
//       setSubmitted(true);
//       navigate('/EmployeeSignInPage'); // Navigate to Employee Sign-In Page after successful sign-up
//     } catch (error: any) {
//       setError(`Failed to create employee account. Please try again. ${error.message}`);
//       console.error('Error during employee sign-up:', error);
//     }
//   };
  
// //-------------------------------------------------------------------------------------------------------

//   return (
//     <Box

//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         maxWidth: '100%',
//         padding: '50px',
//         border: '1px solid #ccc',
//         borderRadius: '8px',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//       }}
//     >

//        {/* "Already have an account" Link */}
//        <Typography variant="body2" sx={{ marginTop: '10px' }}>
//         Already have an account?{' '}
//         <Link
//           component={RouterLink}
//           to="/EmployeeSignInPage"
//           variant="body2"
//           sx={{ textDecoration: 'underline', color: '#6200ea', cursor: 'pointer' }}
//         >
//           Sign In
//         </Link>
//       </Typography>

//       <Typography>Create An Account For Employee</Typography>
//       {submitted && <Typography color="primary">Sign up successful!</Typography>}
//       {error && <Typography color="error">{error}</Typography>}

//       {/* Employee First Name */}
//       <TextField
//         label="First Name"
//         type="text"
//         name="employeeFname"
//         value={employee.employeeFname}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee Last Name */}
//       <TextField
//         label="Last Name"
//         type="text"
//         name="employeeLname"
//         value={employee.employeeLname}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee DOB */}
//       <TextField
//         label="Date of Birth"
//         type="date"
//         name="employeeDob"
//         value={employee.employeeDob}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee Phone */}
//       <TextField
//         label="Phone Number"
//         type="text"
//         name="employeePhone"
//         value={employee.employeePhone}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee Email */}
//       <TextField
//         label="Email"
//         type="email"
//         name="employeeEmail"
//         value={employee.employeeEmail}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee Password */}
//       <TextField
//         label="Password"
//         type="password"
//         name="employeePassword"
//         value={employee.employeePassword}
//         onChange={handleInputChange}
//         required
//         variant="outlined"
//         fullWidth
//       />

//       {/* Employee Type Selection */}
//       <FormControl fullWidth required>
//         <InputLabel>Employee Type</InputLabel>
//         <Select
//           value={employee.employeeType}
//           label="Employee Type"
//           onChange={handleTypeChange}
//         >
//           <MenuItem value="Part-Time">Part-Time</MenuItem>
//           <MenuItem value="Full-Time">Full-Time</MenuItem>
//         </Select>
//       </FormControl>

//       {/* System Side Selection */}
//       <FormControl fullWidth required>
//         <InputLabel>System Side</InputLabel>
//         <Select
//           value={employee.employeeSystem}
//           label="System Side"
//           onChange={handleSystemChange}
//         >
//           <MenuItem value="Dining Side">Dining Side</MenuItem>
//           <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
//         </Select>
//       </FormControl>

//       {/* Position Selection based on System Side */}
//       {employee.employeeSystem === 'Dining Side' && (
//         <FormControl fullWidth required>
//           <InputLabel>Position</InputLabel>
//           <Select
//             value={employee.employeePosition}
//             label="Position"
//             onChange={handlePositionChange}
//           >
//             <MenuItem value="Server">Server</MenuItem>
//             <MenuItem value="Busser">Busser</MenuItem>
//             <MenuItem value="Host">Host</MenuItem>
//           </Select>
//         </FormControl>
//       )}

//       {/* Position is Cook if Kitchen Side */}
//       {employee.employeeSystem === 'Kitchen Side' && (
//         <Typography variant="body1">Position: Cook</Typography>
//       )}

//       {/* Availability Checkboxes */}
//       {Object.keys(availability).map(day => (
//         <FormControl key={day} component="fieldset" sx={{ m: 1, width: '100%' }}>
//           <Typography variant="h6">{day}</Typography>
//           <FormGroup row>
//             {["Morning", "Evening", "Closing", "Off"].map(time => (
//               <FormControlLabel
//                 key={time}
//                 control={
//                   <Checkbox
//                     checked={availability[day].includes(time)}
//                     onChange={() => handleAvailabilityChange(day, time)}
//                   />
//                 }
//                 label={time}
//               />
//             ))}
//           </FormGroup>
//         </FormControl>
//       ))}

//       <Button
//         type="submit"
//         variant="contained"
//         sx={{
//           backgroundColor: '#6200ea',
//           '&:hover': { backgroundColor: '#4b00c7' },
//           width: '50%',
//           marginTop: '20px'
//         }}
//       >
//         Submit
//       </Button>
//     </Box>
//   );
// };

// export default EmployeeSignUpForm;
// src/userAuth/EmployeeSignUp/EmployeeSignUpForm.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SignUpEmployee } from '../../userAuth/services/SignUpEmployee';

//-----------MUI STYLING IMPORT HERE -------------------------------------------------
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Link,
  SelectChangeEvent,
} from '@mui/material';
//------------------------------------------------------------------------------------------

// Define the EmployeeData interface to include availability
interface EmployeeData {
  employeeFname: string;
  employeeLname: string;
  employeeDob: string;
  employeePhone: string;
  employeeEmail: string;
  employeePassword: string;
  employeeType: string;
  employeePosition: string;
  employeeSystem: string;
  employeeAvailability: {
    Monday: string[];
    Tuesday: string[];
    Wednesday: string[];
    Thursday: string[];
    Friday: string[];
    Saturday: string[];
    Sunday: string[];
  };
}

// Employee Sign Up Form Component
const EmployeeSignUpForm: React.FC = () => {
  // Initialize state with all form fields, including availability
  const [employee, setEmployee] = useState<EmployeeData>({
    employeeFname: '',
    employeeLname: '',
    employeeDob: '',
    employeePhone: '',
    employeeEmail: '',
    employeePassword: '',
    employeeType: '',
    employeePosition: '',
    employeeSystem: '',
    employeeAvailability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });

  // Submission States
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Navigation hook
  const navigate = useNavigate();

  // Handle input changes for TextField components
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle availability checkbox changes
  const handleAvailabilityChange = (day: keyof EmployeeData['employeeAvailability'], time: string) => {
    setEmployee((prev) => {
      const currentTimes = prev.employeeAvailability[day];
      return {
        ...prev,
        employeeAvailability: {
          ...prev.employeeAvailability,
          [day]: currentTimes.includes(time)
            ? currentTimes.filter((t) => t !== time)
            : [...currentTimes, time],
        },
      };
    });
  };

  // Handle Employee Type selection (Part-Time or Full-Time)
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setEmployee((prev) => ({
      ...prev,
      employeeType: event.target.value,
    }));
  };

  // Handle System Side selection (Dining Side or Kitchen Side)
  const handleSystemChange = (event: SelectChangeEvent<string>) => {
    const system = event.target.value;
    setEmployee((prev) => ({
      ...prev,
      employeeSystem: system,
      employeePosition: system === 'Kitchen Side' ? 'Cook' : '', // Automatically set position as "Cook" if Kitchen Side
    }));
  };

  // Handle Position selection based on System Side
  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    setEmployee((prev) => ({
      ...prev,
      employeePosition: event.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await SignUpEmployee(employee, employee.employeePassword);
      setSubmitted(true);
      navigate('/EmployeeSignInPage'); // Navigate to Employee Sign-In Page after successful sign-up
    } catch (error: any) {
      setError(`Failed to create employee account. Please try again. ${error.message}`);
      console.error('Error during employee sign-up:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* "Already have an account" Link */}
      <Typography variant="body2" sx={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/EmployeeSignInPage"
          variant="body2"
          sx={{ textDecoration: 'underline', color: '#6200ea', cursor: 'pointer' }}
        >
          Sign In
        </Link>
      </Typography>

      <Typography variant="h5">Create An Account For Employee</Typography>
      {submitted && <Typography color="primary">Sign up successful!</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Employee First Name */}
      <TextField
        label="First Name"
        type="text"
        name="employeeFname"
        value={employee.employeeFname}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee Last Name */}
      <TextField
        label="Last Name"
        type="text"
        name="employeeLname"
        value={employee.employeeLname}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee DOB */}
      <TextField
        label="Date of Birth"
        type="date"
        name="employeeDob" // Ensure consistent naming
        value={employee.employeeDob}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee Phone */}
      <TextField
        label="Phone Number"
        type="text"
        name="employeePhone"
        value={employee.employeePhone}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee Email */}
      <TextField
        label="Email"
        type="email"
        name="employeeEmail"
        value={employee.employeeEmail}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee Password */}
      <TextField
        label="Password"
        type="password"
        name="employeePassword"
        value={employee.employeePassword}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
      />

      {/* Employee Type Selection */}
      <FormControl fullWidth required>
        <InputLabel>Employee Type</InputLabel>
        <Select
          value={employee.employeeType}
          label="Employee Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="Part-Time">Part-Time</MenuItem>
          <MenuItem value="Full-Time">Full-Time</MenuItem>
        </Select>
      </FormControl>

      {/* System Side Selection */}
      <FormControl fullWidth required>
        <InputLabel>System Side</InputLabel>
        <Select
          value={employee.employeeSystem}
          label="System Side"
          onChange={handleSystemChange}
        >
          <MenuItem value="Dining Side">Dining Side</MenuItem>
          <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
        </Select>
      </FormControl>

      {/* Position Selection based on System Side */}
      {employee.employeeSystem === 'Dining Side' && (
        <FormControl fullWidth required>
          <InputLabel>Position</InputLabel>
          <Select
            value={employee.employeePosition}
            label="Position"
            onChange={handlePositionChange}
          >
            <MenuItem value="Server">Server</MenuItem>
            <MenuItem value="Busser">Busser</MenuItem>
            <MenuItem value="Host">Host</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Position is Cook if Kitchen Side */}
      {employee.employeeSystem === 'Kitchen Side' && (
        <Typography variant="body1">Position: Cook</Typography>
      )}

      {/* Availability Checkboxes */}
      {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const).map((day) => (
        <FormControl key={day} component="fieldset" sx={{ m: 1, width: '100%' }}>
          <Typography variant="h6">{day}</Typography>
          <FormGroup row>
            {['Morning', 'Evening', 'Closing', 'Off', 'Anytime'].map((time) => (
              <FormControlLabel
                key={time}
                control={
                  <Checkbox
                    checked={employee.employeeAvailability[day].includes(time)}
                    onChange={() => handleAvailabilityChange(day, time)}
                  />
                }
                label={time}
              />
            ))}
          </FormGroup>
        </FormControl>
      ))}

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#6200ea',
          '&:hover': { backgroundColor: '#4b00c7' },
          width: '50%',
          marginTop: '20px',
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default EmployeeSignUpForm;
