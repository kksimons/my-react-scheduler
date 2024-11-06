// // src/userAuth/components/ManagerSignUpForm.tsx

// // ------ALL MUI IMPORTS HERE -----
// import * as React from 'react';
// import MuiCard from '@mui/material/Card';
// import { Box, Button, FormLabel, FormControl, TextField, Typography, MenuItem, Select, Link as MUILink } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Alert from '@mui/material/Alert';
// // --------------------------------------------------

// import { SignUpManager } from '../services/SignUpManager'; // Correct import
// import { useNavigate , Link as RouterLink } from 'react-router-dom';


// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//   [theme.breakpoints.up('sm')]: {
//     width: '450px',
//   },
// }));

// // Manager Sign Up Form Starts Here 
// const ManagerSignUpForm = () => {
//   const navigate = useNavigate(); 

//   // Form State, set everything to default empty strings
//   const [managerFname, setManagerFname] = React.useState<string>('');
//   const [managerLname, setManagerLname] = React.useState<string>('');
//   const [managerDob, setManagerDob] = React.useState<string>(''); // Use correct hook name setManagerDob
//   const [managerPosition, setManagerPosition] = React.useState<string>('Manager'); // Set default to Manager
//   const [managerEmail, setManagerEmail] = React.useState<string>('');
//   const [managerPassword, setManagerPassword] = React.useState<string>('');

//   // Error State Handling ----------------------------------------------------------
//   const [firstNameError, setFirstNameError] = React.useState<boolean>(false);
//   const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState<string>('');
  
//   const [lastNameError, setLastNameError] = React.useState<boolean>(false);
//   const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState<string>('');

//   const [dobError, setDobError] = React.useState<boolean>(false);
//   const [dobErrorMessage, setDobErrorMessage] = React.useState<string>(''); // Correct capitalization of dobError and dobErrorMessage
  
//   const [emailError, setEmailError] = React.useState<boolean>(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState<string>('');
  
//   const [passwordError, setPasswordError] = React.useState<boolean>(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState<string>('');
  
//   const [submissionError, setSubmissionError] = React.useState<string | null>(null);
//   const [submissionSuccess, setSubmissionSuccess] = React.useState<string | null>(null);
//   const [loading, setLoading] = React.useState<boolean>(false);
//   //----------------------------------------------------------------------------------------

//   // Date validation function to ensure DOB is not in the future or older than 115 years
//   const validateDob = (dob) => {
//     const selectedDate = new Date(dob);
//     const today = new Date();
//     const maxAgeDate = new Date(today.getFullYear() - 115, today.getMonth(), today.getDate());
    
//     if (selectedDate > today) {
//       setDobError(true);
//       setDobErrorMessage('DOB cannot be in the future.');
//       return false;
//     } else if (selectedDate < maxAgeDate) {
//       setDobError(true);
//       setDobErrorMessage('DOB cannot be more than 115 years ago.');
//       return false;
//     }

//     setDobError(false);
//     setDobErrorMessage('');
//     return true;
//   };

//   // Input Validation Function
//   const validateInputs = () => {
//     let isValid = true;

//     // First Name Validation
//     if (!managerFname.trim()) {
//       setFirstNameError(true);
//       setFirstNameErrorMessage('First name is required.');
//       isValid = false;
//     } else {
//       setFirstNameError(false);
//       setFirstNameErrorMessage('');
//     }

//     // Last Name Validation
//     if (!managerLname.trim()) {
//       setLastNameError(true);
//       setLastNameErrorMessage('Last name is required.');
//       isValid = false;
//     } else {
//       setLastNameError(false);
//       setLastNameErrorMessage('');
//     }

//     // DOB Validation
//     if (!validateDob(managerDob)) {
//       isValid = false;
//     }

//     // Email Validation
//     if (!managerEmail.trim() || !/\S+@\S+\.\S+/.test(managerEmail)) {
//       setEmailError(true);
//       setEmailErrorMessage('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     // Password Validation
//     if (!managerPassword || managerPassword.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage('Password must be at least 6 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage('');
//     }

//     return isValid;
//   };

//   // Handle Sign Up Submission
//   const handleSignUp = async (event) => {
//     event.preventDefault();
//     setSubmissionError(null);
//     setSubmissionSuccess(null);

//     // Validate inputs before submission
//     if (!validateInputs()) return;
//     setLoading(true);

//     try {
//       // Pass the correct state variables to the SignUpManager service
//       await SignUpManager(managerFname, managerLname, managerDob, managerPosition, managerEmail, managerPassword);
//       setSubmissionSuccess('Account created successfully! Redirecting to manager dashboard...');
//       // Redirect to Manager Sign in after a short delay
//       setTimeout(() => {
//         navigate('/ManagerSignUpPage');
//       }, 1000);
//     } catch (error) {
//       console.error('Failed to create account, please try again:', error);

//       if (error.code === 'auth/email-already-in-use') {
//         setSubmissionError('This email is already in use.');
//       } else {
//         setSubmissionError('Failed to create account. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Note: e = event 
//   return (
//     <Card variant="outlined">
//       <Typography
//         component="h1"
//         variant="h4"
//         sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
//       >
//         Create Account
//       </Typography>
      
//       {submissionError && (
//         <Alert severity="error">{submissionError}</Alert>
//       )}
      
//       {submissionSuccess && (
//         <Alert severity="success">{submissionSuccess}</Alert>
//       )}
      
//       <Box
//         component="form"
//         onSubmit={handleSignUp}
//         noValidate
//         sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
//       >
//         {/* First Name Input */}
//         <FormControl>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormLabel htmlFor="managerFname">First Name</FormLabel>
//           </Box>
//           <TextField
//             error={firstNameError}
//             helperText={firstNameErrorMessage}
//             id="managerFname"
//             type="text"
//             name="managerFname"
//             placeholder="John"
//             autoComplete="given-name"
//             required
//             fullWidth
//             variant="outlined"
//             value={managerFname}
//             onChange={(e) => setManagerFname(e.target.value)}
//             color={firstNameError ? 'error' : 'primary'}
//           />
//         </FormControl>
        
//         {/* Last Name Input */}
//         <FormControl>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormLabel htmlFor="managerLname">Last Name</FormLabel>
//           </Box>
//           <TextField
//             error={lastNameError}
//             helperText={lastNameErrorMessage}
//             id="managerLname"
//             type="text"
//             name="managerLname"
//             placeholder="Doe"
//             autoComplete="family-name"
//             required
//             fullWidth
//             variant="outlined"
//             value={managerLname}
//             onChange={(e) => setManagerLname(e.target.value)}
//             color={lastNameError ? 'error' : 'primary'}
//           />
//         </FormControl>

//         {/* Email Input */}
//         <FormControl>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormLabel htmlFor="managerEmail">Email</FormLabel>
//           </Box>
//           <TextField
//             error={emailError}
//             helperText={emailErrorMessage}
//             id="managerEmail"
//             type="email"
//             name="managerEmail"
//             placeholder="your@email.com"
//             autoComplete="email"
//             required
//             fullWidth
//             variant="outlined"
//             value={managerEmail}
//             onChange={(e) => setManagerEmail(e.target.value)}
//             color={emailError ? 'error' : 'primary'}
//           />
//         </FormControl>
        
//         {/* Password Input */}
//         <FormControl>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormLabel htmlFor="managerPassword">Password</FormLabel>
//           </Box>
//           <TextField
//             error={passwordError}
//             helperText={passwordErrorMessage}
//             name="managerPassword"
//             placeholder="Enter your password"
//             type="password"
//             id="managerPassword"
//             autoComplete="new-password"
//             required
//             fullWidth
//             variant="outlined"
//             value={managerPassword}
//             onChange={(e) => setManagerPassword(e.target.value)}
//             color={passwordError ? 'error' : 'primary'}
//           />
//         </FormControl>

//         {/* Position Select */}
//         <FormControl>
//           <FormLabel htmlFor="managerPosition">Position</FormLabel>
//           <Select
//             id="managerPosition"
//             value={managerPosition}
//             onChange={(e) => setManagerPosition(e.target.value)}
//             required
//             fullWidth
//           >
//             <MenuItem value="Manager">Manager</MenuItem>
//           </Select>
//         </FormControl>


//         {/* DOB Input */}
//         <FormControl>
//           <FormLabel htmlFor="managerDob">Date of Birth</FormLabel>
//           <TextField
//             error={dobError}
//             helperText={dobErrorMessage}
//             id="managerDob"
//             type="date"
//             required
//             fullWidth
//             value={managerDob}
//             onChange={(e) => setManagerDob(e.target.value)}
//           />
//         </FormControl>

//         {/* Sign Up Button */}
//         <Button 
//           type="submit" 
//           fullWidth 
//           variant="contained"
//           disabled={loading}
//           sx={{ 
//             backgroundColor: '#5201C3', 
//             '&:hover': { backgroundColor: '#6200ea' },
//             height: '50px',
//             fontSize: '16px',
//           }}
//         >
//           {loading ? 'Signing Up...' : 'Sign Up'}
//         </Button>
        
//         {/* Link to Sign-In Page */}
//         <MUILink
//             component={RouterLink}
//             to="/ManagerSignInPage"
//             variant="body2"
//             sx={{ alignSelf: 'center', fontSize: '18px', textDecoration: 'none' }}
//           >
//             Sign In
//         </MUILink>
//       </Box>
//     </Card>
//   );
// }

// export default ManagerSignUpForm; 
