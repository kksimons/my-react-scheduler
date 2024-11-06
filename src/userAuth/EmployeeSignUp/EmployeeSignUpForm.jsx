// import React, { useState } from 'react';
// import {
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   FormLabel,
//   Box,
//   Grid,
//   Typography,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import SignUpEmployee from '../services/SignUpEmployee';
// //import EmployeeSignInPage from '../EmployeeSignInPage';

// const EmployeeSignUpForm = () => {
//   const [formData, setFormData] = useState({
//     employee_fname: '',
//     employee_lname: '',
//     employee_dob: '',
//     employee_gender: '',
//     employee_phone_number: '',
//     employee_email: '',
//     employee_password: '',
//     employee_availability: {
//       monday: [],
//       tuesday: [],
//       wednesday: [],
//       thursday: [],
//       friday: []
//     },
//     employee_type: '',
//     employee_position: []
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleAvailabilityChange = (day, shift) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       employee_availability: {
//         ...prevState.employee_availability,
//         [day]: prevState.employee_availability[day].includes(shift)
//           ? prevState.employee_availability[day].filter((s) => s !== shift)
//           : [...prevState.employee_availability[day], shift]
//       }
//     }));
//   };

//   const handlePositionChange = (position) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       employee_position: prevState.employee_position.includes(position)
//         ? prevState.employee_position.filter((p) => p !== position)
//         : [...prevState.employee_position, position]
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const { employee_fname, employee_lname, employee_dob, employee_gender, employee_phone_number, employee_email, employee_password, employee_type, employee_position, employee_availability } = formData;

//     // Debugging: Log form data
//     console.log("Form Data:", formData);

//     try {
//       await SignUpEmployee({
//         email, password,
//         employee_fname,
//         employee_lname,
//         employee_dob,
//         employee_gender,
//         employee_phone_number: employee_phone_number.toString(),
//         employee_email,
//         employee_type,
//         employee_position: employee_position.join(", "), // Convert to string
//         employee_availability: JSON.stringify(employee_availability), // Convert availability to JSON string
//         employee_system: "Kitchen Side", "Dining Side" // Placeholder for employee_system; replace with actual value
//       }, employee_password);
//       console.log("Employee signed up successfully.");
//       navigate('/EmployeeSignInPage');
//     } catch (error) {
//       console.log('Error signing up employee. Please try again.');
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             label="First Name"
//             name="employee_fname"
//             value={formData.employee_fname}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Last Name"
//             name="employee_lname"
//             value={formData.employee_lname}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Date of Birth"
//             type="date"
//             name="employee_dob"
//             value={formData.employee_dob}
//             onChange={handleChange}
//             required
//             fullWidth
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth required>
//             <InputLabel>Gender</InputLabel>
//             <Select
//               name="employee_gender"
//               value={formData.employee_gender}
//               onChange={handleChange}
//             >
//               <MenuItem value=""><em>Select</em></MenuItem>
//               <MenuItem value="male">Male</MenuItem>
//               <MenuItem value="female">Female</MenuItem>
//               <MenuItem value="other">Other</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Phone Number"
//             type="tel"
//             name="employee_phone_number"
//             value={formData.employee_phone_number}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Email"
//             type="email"
//             name="employee_email"
//             value={formData.employee_email}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Password"
//             type="password"
//             name="employee_password"
//             value={formData.employee_password}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <FormLabel component="legend">Availability</FormLabel>
//           {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
//             <Box key={day} mb={1}>
//               <Typography>{day.charAt(0).toUpperCase() + day.slice(1)}:</Typography>
//               <FormGroup row>
//                 {['morning', 'opening', 'closing'].map((shift) => (
//                   <FormControlLabel
//                     key={shift}
//                     control={
//                       <Checkbox
//                         checked={formData.employee_availability[day].includes(shift)}
//                         onChange={() => handleAvailabilityChange(day, shift)}
//                       />
//                     }
//                     label={shift.charAt(0).toUpperCase() + shift.slice(1)}
//                   />
//                 ))}
//               </FormGroup>
//             </Box>
//           ))}
//         </Grid>
//         <Grid item xs={12}>
//           <FormControl fullWidth required>
//             <InputLabel>Employee Type</InputLabel>
//             <Select
//               name="employee_type"
//               value={formData.employee_type}
//               onChange={handleChange}
//             >
//               <MenuItem value=""><em>Select</em></MenuItem>
//               <MenuItem value="full-time">Full Time</MenuItem>
//               <MenuItem value="part-time">Part Time</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <FormLabel component="legend">Position</FormLabel>
//           <FormGroup row>
//             {['server', 'busser', 'host'].map((position) => (
//               <FormControlLabel
//                 key={position}
//                 control={
//                   <Checkbox
//                     checked={formData.employee_position.includes(position)}
//                     onChange={() => handlePositionChange(position)}
//                   />
//                 }
//                 label={position.charAt(0).toUpperCase() + position.slice(1)}
//               />
//             ))}
//           </FormGroup>
//         </Grid>
//         <Grid item xs={12}>
//           <Button type="submit" variant="contained" color="primary">
//             Sign Up
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default EmployeeSignUpForm;
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const EmployeeSignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Additional field example

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional data in Firestore
      await setDoc(doc(db, "employees", user.uid), {
        role, // Save the additional data here
        email
      });

      console.log("User signed up and additional data saved.");
    } catch (error) {
      console.error("Error signing up: ", error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role (e.g., Employee or Manager)"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default EmployeeSignUpForm;
