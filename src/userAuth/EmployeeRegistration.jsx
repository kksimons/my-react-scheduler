
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    FormControl,
    FormHelperText,
    FormLabel,
    Select,
    MenuItem,
    TextField,
    ThemeProvider,
} from "@mui/material";
import {
    getFirestore,
    doc,
    setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import theme from "@theme/theme";
import { useAuth } from "./contexts/AuthContext";

const EmployeeRegistration = () => { 
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        phoneNumber: "",
        systemSide: "",
        position: "",
        employeeType: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        if (formData.systemSide === "Kitchen Side") {
            setFormData((prevData) => ({
                ...prevData,
                position: "Cook",
            }));
        } else if (formData.systemSide === "Dining Side") {
            setFormData((prevData) => ({
                ...prevData,
                position: "", // Reset to allow selection
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                position: "",
            }));
        }
    }, [formData.systemSide]);

    const handleChange = (e) => {
        // Prevent changing the position manually only when it's disabled
        if (e.target.name === "position" && formData.systemSide === "Kitchen Side") {
            return;
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value, 

            //Clear position when systemSide changes to prevent leftover values
            ...(e.target.name === "systemSide" && {position: ""}),
        });
    };

    const validateForm = () => {
        const errors = {};
        const phoneRegex = /^\d{10,15}$/; // Adjusted to enforce minimum 10 digits
        const nameRegex = /^[a-zA-Z]+$/;
        const dob = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 13 || age > 120) {
            errors.dob = "Employee must be at least 13 years old and at most 120 years old";
        }

        if (!phoneRegex.test(formData.phoneNumber)) {
            errors.phoneNumber = "Phone number must be between 10 and 15 digits long and contain only numbers";
        }

        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = "First name must contain only letters";
        }

        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = "Last name must contain only letters";
        }

        if (!formData.systemSide) {
            errors.systemSide = "System Side is required";
        }

        if (!formData.position) {
            errors.position = "Position is required";
        }

        if (!formData.employeeType) {
            errors.employeeType = "Employee Type is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        const user = auth.currentUser;
    
        if (user) { // Corrected variable name
            try {
                // Store employee information in Firestore
                await setDoc(doc(db, "employees", user.uid), {
                    employee_fname: formData.firstName,
                    employee_lname: formData.lastName,
                    employee_dob: formData.dob,
                    employee_email: user.email, // Use user.email from authentication 
                    employee_phone_number: formData.phoneNumber,
                    employee_system: formData.systemSide,
                    employee_position: formData.position,
                    employee_type: formData.employeeType,
                    availability: {}, // Placeholder for availability to be filled in later
                    photoURL: "", // Placeholder for profile picture URL
                });

                // Redirect to the Availability page
                navigate("/Availability");
            } catch (error) {
                console.error("Error during registration: ", error);
            }
        } else {
            console.error("No user is signed in");
            // Optionally, redirect to the sign-in page
            navigate("/SignIn");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box             
                display="flex"
                alignItems="center"
                minHeight="100vh" // Full viewport height to center vertically
                bgcolor="background.default"
                p="auto" 
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit} 
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    backgroundColor="theme.palette.background.third"
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
                        Employee Registration
                    </Typography>

                    {/* First Name */}
                    <FormControl error={!!formErrors.firstName}>
                        <FormLabel>First Name:</FormLabel>
                        <TextField
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                            placeholder="e.g., John"
                            required
                        />
                    </FormControl>
                    
                    {/* Last Name */}
                    <FormControl error={!!formErrors.lastName}>
                        <FormLabel>Last Name:</FormLabel>
                        <TextField
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                            placeholder="e.g., Doe"
                            required
                        />
                    </FormControl>
                    
                    {/* Date of Birth */}
                    <FormControl error={!!formErrors.dob}>
                        <FormLabel>Date of Birth:</FormLabel>
                        <TextField
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            error={!!formErrors.dob}
                            helperText={formErrors.dob}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    
                    {/* Phone Number */}
                    <FormControl error={!!formErrors.phoneNumber}>
                        <FormLabel>Phone Number:</FormLabel>
                        <TextField
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!formErrors.phoneNumber}
                            helperText={formErrors.phoneNumber}
                            placeholder="e.g., 1234567890"
                            required
                        />
                    </FormControl>

                    {/* System Side Field */}
                    <FormControl error={!!formErrors.systemSide}>
                        <FormLabel>System Side</FormLabel>
                        <Select
                            name="systemSide"
                            value={formData.systemSide}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="" disabled>
                                Select System Side
                            </MenuItem>
                            <MenuItem value="Kitchen Side">Kitchen Side</MenuItem>
                            <MenuItem value="Dining Side">Dining Side</MenuItem>
                        </Select>
                        {formErrors.systemSide && (
                            <FormHelperText>{formErrors.systemSide}</FormHelperText>
                        )}
                    </FormControl>

                {/* Position Field */}
                <FormControl error={!!formErrors.position}>
                    <FormLabel>Position</FormLabel>
                    <Select
                        labelId="position-label"
                        id="position-select"
                        name="position"
                        value={formData.position}
                        required
                        onChange={handleChange}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select Position
                        </MenuItem>
                        {formData.systemSide === "Kitchen Side" && (
                            <MenuItem value="Cook">Cook</MenuItem>
                        )}
                        {formData.systemSide === "Dining Side" && [
                            <MenuItem value="Server" key="server">Server</MenuItem>,
                            <MenuItem value="Busser" key="busser">Busser</MenuItem>
                        ]}
                    </Select>
                    {formErrors.position && (
                        <FormHelperText>{formErrors.position}</FormHelperText>
                    )}
                </FormControl>

                    
                    {/* Employee Type */}
                    <FormControl error={!!formErrors.employeeType}>
                        <FormLabel>Employee Type</FormLabel>
                        <Select
                            labelId="employee-type-label"
                            id="employee-type-select"
                            name="employeeType"
                            value={formData.employeeType}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="" disabled>Select Employee Type</MenuItem>
                            <MenuItem value="Part-time">Part-time</MenuItem>
                            <MenuItem value="Full-time">Full-time</MenuItem>
                        </Select>
                        {formErrors.employeeType && (
                            <FormHelperText>{formErrors.employeeType}</FormHelperText>
                        )}
                    </FormControl>
                    
                    {/* Submit Button */}
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
