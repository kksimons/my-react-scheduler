// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Button, Container, Typography } from "@mui/material";
// import { FormControl, FormLabel, TextField } from "@mui/material";
// import { useState } from "react";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import theme from "@theme/theme";
// import { ThemeProvider } from "@mui/system";

// const EmployerRegistration = () => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         // email: "",
//         dob: "",
//         phoneNumber: "",
//         systemSide: "",
//         position: "",

//     });

//     const [formErrors, setFormErrors] = useState({});
//     const navigate = useNavigate();
//     const db = getFirestore();
//     const auth = getAuth();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const validateForm = () => {
//         const errors = {};
//         const phoneRegex = /^\d{3,15}$/;
//         const nameRegex = /^[a-zA-Z]+$/;
//         const dob = new Date(formData.dob);
//         const age = new Date().getFullYear() - dob.getFullYear();


//         if (age < 13 || age > 120) {
//             errors.dob = "Employee must be at least 13 years old and at most 120 years old";
//         }

//         if (!phoneRegex.test(formData.phoneNumber)) {
//             errors.phoneNumber = "Phone number must be at least 10 digits long and contain only numbers";
//         }

//         if (!nameRegex.test(formData.firstName)) {
//             errors.firstName = "First name must contain only letters";
//         }

//         if (!nameRegex.test(formData.lastName)) {
//             errors.lastName = "Last name must contain only letters";
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         //check current user 
//         const user = auth.currentUser;
//         if (user) {
//             try {
//                 await addDoc(collection(db, "employers"), {
//                     employer_fname: formData.firstName,
//                     employer_lname: formData.lastName,
//                     employee_dob: formData.dob,
//                     employer_phone_number: formData.phoneNumber,
//                     employer_system: formData.systemSide,
//                     employer_position: formData.position,  
//                     employer_profilePic: null,
//                     userId: user.uid
//                 });

//                 navigate("/ManagerDashBoard");
//             } catch (error) {
//                 console.error("Error adding document: ", error);
//             }
//         }
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <Box
//                 display="flex"
//                 alignItems="center"
//                 minHeight="100vh"
//                 bgcolor="background.default"
//                 p= "auto"
//             >
//                 <Box
//                     component="form"
//                     onSubmit={handleSubmit}
//                     display="flex"
//                     flexDirection="column"
//                     gap="8px"
//                     backgroundColor="background.third"
//                     sx={{
//                         width: '100%',
//                         maxWidth: '500px',
//                         mx: 'auto',
//                         p: 6,
//                         borderRadius: 5,
//                         boxShadow: 5,
//                     }}
//                 >
//                     <Typography variant="h5" component="h6" gutterBottom>
//                         Employer Registration
//                     </Typography>
//                     <FormControl>
//                         <FormLabel>First Name:</FormLabel>
//                         <TextField
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleChange}
//                             error={!!formErrors.firstName}
//                             helperText={formErrors.firstName}
//                             placeholder="ex. John"
//                             required
//                         />
//                     </FormControl>

//                     <FormControl>
//                         <FormLabel>Last Name:</FormLabel>
//                         <TextField
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             error={!!formErrors.lastName}
//                             helperText={formErrors.lastName}
//                             placeholder="ex. Doe"
//                             required
//                         />
//                     </FormControl>

//                     {/* <FormControl>
//                         <FormLabel>Email:</FormLabel>
//                         <TextField
//                             name="email"
//                             type="email"
//                             placeholder="ex. user@example.com"
//                             value={formData.email}
//                             onChange={handleChange}
//                             error={!!formErrors.email}
//                             helperText={formErrors.email}
//                             required
//                         />
//                     </FormControl> */}

//                     {/* <FormControl>
//                         <FormLabel>Password:</FormLabel>
//                         <TextField
//                             name="password"
//                             type="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             error={!!formErrors.password}
//                             helperText={formErrors.password}
//                             required
//                         />
//                     </FormControl> */}
//                 <FormControl>
//                     <FormLabel>Date of Birth:</FormLabel>
//                     <TextField
//                         name="dob"
//                         type="date"
//                         value={formData.dob}
//                         onChange={handleChange}
//                         error={!!formErrors.dob}
//                         helperText={formErrors.dob}
//                         required
//                     />
//                 </FormControl>
                
//                 <FormControl>
//                     <FormLabel>Phone Number:</FormLabel>
//                     <TextField
//                         name="phoneNumber"
//                         value={formData.phoneNumber}
//                         onChange={handleChange}
//                         error={!!formErrors.phoneNumber}
//                         helperText={formErrors.phoneNumber}
//                         required
//                     />
//                 </FormControl>
                
//                 <FormControl>
//                     <FormLabel>System Side:</FormLabel>
//                     <Select
//                         name="systemSide"
//                         value={formData.systemSide}
//                         onChange={handleChange}
//                         error={!!formErrors.systemSide}
//                         displayEmpty // It will show the Select system side, This makes the empty MenuItem display like a placeholder
//                         required
//                     >
//                         <MenuItem value="" disable>Select System Side</MenuItem>
//                         <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
//                         <MenuItem value="Dining Side">Dining Side</MenuItem>
//                     </Select>
//                     {formErrors.systemSide && <FormHelperText error>{formErrors.systemSide}</FormHelperText>}
//                 </FormControl>

//                 {formData.systemSide === "Kitchen Side" && (
//                     <FormControl>
//                         <FormLabel>Position:</FormLabel>
//                         <Select
//                             displayEmpty
//                         >
//                             <MenuItem value="" disabled>Select Position</MenuItem>
//                             <MenuItem value="position">Cook</MenuItem>
//                         </Select>
//                     </FormControl>
//                 )}

//                 {formData.systemSide === "Dining Side" && (
//                     <FormControl>
//                         <FormLabel>Position:</FormLabel>
//                         <Select
//                             name="position"
//                             value={formData.position}
//                             onChange={handleChange}
//                             displayEmpty
//                             required
//                         >
//                             <MenuItem value="" disabled>Select Position</MenuItem>
//                             <MenuItem value="Server">Server</MenuItem>
//                             <MenuItem value="Busser">Busser</MenuItem>
//                             <MenuItem value="Host">Host</MenuItem>
//                         </Select>
//                     </FormControl>
//                 )}

//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             mt: 2,
//                             boxShadow: 3,
//                             '&:hover': {
//                                 boxShadow: 6,
//                             },
//                         }}
//                     >
//                         Submit
//                     </Button>
//                 </Box>
//             </Box>
//         </ThemeProvider>
//     );
// };

// export default EmployerRegistration;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, FormControl, FormLabel, TextField, Select, MenuItem, FormHelperText, ThemeProvider } from "@mui/material";
import { getFirestore, collection, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import theme from "@theme/theme";


const EmployerRegistration = () => { 

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        phoneNumber: "",
        systemSide: "",
        position: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const errors = {};
        const phoneRegex = /^\d{3,15}$/;
        const nameRegex = /^[a-zA-Z]+$/;
        const dob = new Date(formData.dob);
        const age = new Date().getFullYear() - dob.getFullYear();

        if (age < 13 || age > 120) {
            errors.dob = "Employee must be at least 13 years old and at most 120 years old";
        }

        if (!phoneRegex.test(formData.phoneNumber)) {
            errors.phoneNumber = "Phone number must be at least 10 digits long and contain only numbers";
        }

        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = "First name must contain only letters";
        }

        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = "Last name must contain only letters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        //check current user 
        const user = auth.currentUser;
        if (user) {
            try {
                await setDoc(doc(db, "employers", user.uid), {
                    employer_fname: formData.firstName,
                    employer_lname: formData.lastName,
                    // employer_email: formData.email,
                    employer_dob: formData.dob,
                    employer_phone_number: formData.phoneNumber,
                    employer_system: formData.systemSide,
                    employer_position: formData.position,
                });

                navigate("/SignIn");
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    return (
    <ThemeProvider theme={theme}>
        <Box             
            display="flex"
            alignItems="center"
            //justifyContent="center"
            minHeight="100vh" // Full viewport height to center vertically
            bgcolor="background.default"
            py= {8} 
        >
            <Box
                component="form"
                // onSubmit={handleSubmit} 
                display="flex"
                flexDirection="column"
                gap={1}
                backgroundColor="background.third"
                sx={{ 
                    width: '100%',
                     maxWidth: '500px',
                         mx: 'auto',
                          p: 6,
                          borderRadius: 5,
                           boxShadow: 5,
                         }}
            >
                <Typography variant="h5" component="h6" gutterBottom>
                    Employer Registration
                </Typography>
                <FormControl>
                    <FormLabel>First Name:</FormLabel>
                    <TextField
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                        placeholder="John"
                        required
                    />
                </FormControl>
                
                <FormControl>
                    <FormLabel>Last Name:</FormLabel>
                    <TextField
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                        placeholder="Doe"
                        required
                    />
                </FormControl>
                
                {/* <FormControl>
                    <FormLabel>Email:</FormLabel>
                    <TextField
                        name="email"
                        type="email"
                        placeholder="ex. user@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        required
                    />
                </FormControl> */}
                
                <FormControl>
                    <FormLabel>Date of Birth:</FormLabel>
                    <TextField
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        error={!!formErrors.dob}
                        helperText={formErrors.dob}
                        required
                    />
                </FormControl>
                
                <FormControl>
                    <FormLabel>Phone Number:</FormLabel>
                    <TextField
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={!!formErrors.phoneNumber}
                        helperText={formErrors.phoneNumber}
                        required
                    />
                </FormControl>
                
                {formData.systemSide === "Kitchen Side" && (
                    <FormControl>
                        <FormLabel>System Side:</FormLabel>
                        <Select
                            name="systemSide"
                            value={formData.systemSide}
                            onChange={handleChange}
                            error={!!formErrors.systemSide}
                            displayEmpty // It will show the Select system side, This makes the empty MenuItem display like a placeholder
                            required
                        >
                            <MenuItem value="" disable>Select System Side</MenuItem>
                            <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
                            <MenuItem value="Dining Side">Dining Side</MenuItem>
                        </Select>
                        {formErrors.systemSide && <FormHelperText error>{formErrors.systemSide}</FormHelperText>}
                    </FormControl>
                )}

                {formData.systemSide === "Kitchen Side" && (
                    <FormControl>
                        <FormLabel>Position:</FormLabel>
                        <Select
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Position</MenuItem>
                            <MenuItem value="position">Kitchen Manager</MenuItem>
                        </Select>
                    </FormControl>
                )}

                {formData.systemSide === "Dining Side" && (
                    <FormControl>
                        <FormLabel>Position:</FormLabel>
                        <Select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            displayEmpty
                            required
                        >
                            <MenuItem value="" disabled>Select Position</MenuItem>
                            <MenuItem value="Server">Dining Manager</MenuItem>
                        </Select>
                    </FormControl>
                )}
                               
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        mt: 2,
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                        },
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    </ThemeProvider>
    );
};

export default EmployerRegistration;
