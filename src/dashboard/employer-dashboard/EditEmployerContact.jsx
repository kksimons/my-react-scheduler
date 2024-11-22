// Resources 
// CHATGPT
import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, FormControl, FormLabel, ThemeProvider, Typography } from "@mui/material";
import theme from "@theme/theme";

const EditEmployerContact = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        systemSide: "",
        position: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const db = getFirestore();

    const contact = location.state?.contact;

    useEffect(() => {
        const fetchContact = async () => {
            if (contact) {
                setFormData({
                    firstName: contact.employer_fname,
                    lastName: contact.employer_lname,
                    email: contact.employer_email,
                    phoneNumber: contact.employer_phone_number,
                    systemSide: contact.employer_system,
                    position: contact.employer_position
                });
            }
            setIsLoading(false);
        };

        fetchContact();
    }, [contact]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const contactRef = doc(db, "employers", contact.id);
            await updateDoc(contactRef, {
                employer_fname: formData.firstName,
                employer_lname: formData.lastName,
                employer_email: formData.email,
                employer_phone_number: formData.phoneNumber,
                employer_system: formData.systemSide,
                employer_position: formData.position
            });
            navigate("/contactList");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ width: '100%', maxWidth: 500, margin: 'auto', padding: 3 }}
            >
                <Typography variant="h5" color="primary.dark" gutterBottom>Edit Contact</Typography>
                {!isLoading && (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>First Name</FormLabel>
                            <TextField
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>Last Name</FormLabel>
                            <TextField
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>Email</FormLabel>
                            <TextField
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>Phone Number</FormLabel>
                            <TextField
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>System Side</FormLabel>
                            <TextField
                                name="systemSide"
                                value={formData.systemSide}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>Position</FormLabel>
                            <TextField
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save Changes
                        </Button>
                    </form>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default EditEmployerContact;
