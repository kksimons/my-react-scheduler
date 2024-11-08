import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import theme from "@theme/theme";
import { ThemeProvider } from "@mui/system";

const EmployerRegistration = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
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

        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter correct email format: user@example.com ";
        }

        if (formData.password.length < 6 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
            errors.password = "Password must be at least 6 characters long, contain both numbers and letters";
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

            await addDoc(collection(db, "employers"), {
                employer_fname: formData.firstName,
                employer_lname: formData.lastName,
                employer_email: formData.email,
                employer_profilePic: null,
                userId: user.uid
            });

            navigate("/Dashboard");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                alignItems="center"
                minHeight="100vh"
                bgcolor="background.default"
                p= "auto"
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    gap="8px"
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

export default EmployerRegistration;