import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, FormControl, FormLabel, TextField, Select, MenuItem, FormHelperText, ThemeProvider } from "@mui/material";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import theme from "@theme/theme";

const EmployeeRegistration = () => { 

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        phoneNumber: "",
        systemSide: "",
        position: "",
        employeeType: "",
        password: ""
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{3,15}$/;
        const nameRegex = /^[a-zA-Z]+$/;
        const dob = new Date(formData.dob);
        const age = new Date().getFullYear() - dob.getFullYear();

        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter correct email format: user@example.com ";
        }

        if (formData.password.length < 6 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
            errors.password = "Password must be at least 6 characters long, contain both numbers and letters";
        }

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

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await addDoc(collection(db, "employees"), {
                employee_fname: formData.firstName,
                employee_lname: formData.lastName,
                employee_email: formData.email,
                employee_dob: formData.dob,
                employee_phone_number: formData.phoneNumber,
                employee_system: formData.systemSide,
                employee_position: formData.position,
                employee_type: formData.employeeType
            });

            navigate("/Availability");
        } catch (error) {
            console.error("Error adding document: ", error);
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
            p= "auto" 
        >
            <Box
                component="form"
                onSubmit={handleSubmit} 
                display="flex"
                flexDirection="column"
                gap={1}
                backgroundColor= "theme.palette.background.third"
                sx={{ width: '100%',
                     maxWidth: '500px',
                         mx: 'auto',
                          p: 6,
                          borderRadius: 5,
                           boxShadow: 5,
                         }}
            >
                <Typography variant="h5" component="h6" gutterBottom>
                    Employee Registration
                </Typography>
                <FormControl>
                    <FormLabel>First Name:</FormLabel>
                    <TextField
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                        placeholder="ex. John"
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
                        placeholder="ex. Doe"
                        required
                    />
                </FormControl>
                
                <FormControl>
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
                </FormControl>
                
                <FormControl>
                    <FormLabel>Password:</FormLabel>
                    <TextField
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        required
                    />
                </FormControl>
                
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

                {formData.systemSide === "Kitchen Side" && (
                    <FormControl>
                        <FormLabel>Position:</FormLabel>
                        <Select
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Position</MenuItem>
                            <MenuItem value="position">Cook</MenuItem>
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
                            <MenuItem value="Server">Server</MenuItem>
                            <MenuItem value="Busser">Busser</MenuItem>
                            <MenuItem value="Host">Host</MenuItem>
                        </Select>
                    </FormControl>
                )}
                
                <FormControl>
                    <FormLabel>Employee Type:</FormLabel>
                    <Select
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleChange}
                        placeholder="Select Employee Type"
                        displayEmpty
                        required
                    >
                        <MenuItem value="" disable>Select Employee Type</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Full-time">Full-time</MenuItem>
                    </Select>
                </FormControl>
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
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

export default EmployeeRegistration;
