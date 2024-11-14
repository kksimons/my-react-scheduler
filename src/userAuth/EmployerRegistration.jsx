import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, FormControl, FormLabel, TextField, Select, MenuItem, FormHelperText, ThemeProvider } from "@mui/material";
import { getFirestore, collection, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import theme from "@theme/theme";
import { useAuth } from "@userAuth/contexts/AuthContext";
//import { FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { FormControlLabel } from "@mui/material";




const EmployerRegistration = () => { 
    
    const { user } = useAuth(); 
    //const navigate = useNavigate();
    //const [formData, setFormData] = useState({

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        phoneNumber: "",
        systemSide: "",
        position: "",
    });

    const [formErrors, setFormErrors] = useState({}); //form error 
    const navigate = useNavigate(); //navigate to another page
    const db = getFirestore(); //get firestore database
    //const auth = getAuth();


      // Update the position based on the selected system side,
      // if user choose kitchen side, the position will be Kitchen Manager
      // if user choose dining side, the position will be Dining Manager and user can not choose otherway 
    useEffect(() => {
        if (formData.systemSide === "Kitchen Side") {
        setFormData((prevData) => ({
            ...prevData,
            position: "Kitchen Manager",
        }));
        } else if (formData.systemSide === "Dining Side") {
        setFormData((prevData) => ({
            ...prevData,
            position: "Dining Manager",
        }));
        } else {
        setFormData((prevData) => ({
            ...prevData,
            position: "",
        }));
        }
    }, [formData.systemSide]);

    //handle form input changes
    const handleChange = (e) => {
        // Prevent changing the position manually
        if (e.target.name === "position") {
            return;
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };
    
    //validate input fields for form submission
    const validateForm = () => {
        const errors = {};
        const phoneRegex = /^\d{3,15}$/;
        const nameRegex = /^[a-zA-Z]+$/;
        const dob = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear(); //calculate age //i use let because it is changeable
        const monthDifference = today.getMonth() - dob.getMonth(); //calculate month difference


        // if birthday hasn't occurred yet this year 
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }
        //check if the input fields are empty 
        //isNaN is a JavaScript function that checks whether a value is "Not-a-Number" (NaN).
        // It returns true if the value is NaN, and false otherwise
        if (isNaN(age)) {
            errors.dob = "Please enter a valid date of birth.";
        } else if (age < 13 || age > 120) {
            errors.dob =
            "Employer must be at least 13 years old and at most 120 years old.";
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

        if (!formData.systemSide) {
            errors.systemSide = "Please select a system side.";
          }
      
        if (!formData.position) {
        errors.position = "Position is required.";
        }

        //sets form errors and returns a boolean indicating whether the form is valid or not.
        //if the length of the form === 0 which means there is 0 error 
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        //check current user 
        //const user = auth.currentUser;
        if (user) {
            try {
                await setDoc(
                    doc(db, "employers", user.uid), 
                    {
                    employer_fname: formData.firstName,
                    employer_lname: formData.lastName,
                    employer_email: user.email,
                    employer_dob: formData.dob,
                    employer_phone_number: formData.phoneNumber,
                    employer_system: formData.systemSide,
                    employer_position: formData.position,
                }, 
                { merge: true } //merge the data with the existing data
            );

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
            minHeight="100vh"
            bgcolor="background.default"
            py= {8} 
        >
            <Box
                component="form"
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


                {/* System Side Field */}
                <FormControl error={!!formErrors.systemSide}> 
                    <FormLabel>System Side</FormLabel>
                    <Select
                    labelId="system-side-label"
                    id="system-side-select"
                    name="systemSide"
                    value={formData.systemSide}
                    onChange={handleChange} //put handle change here and it will active the useEffect
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
                {formData.systemSide && (
                    <FormControl error={!!formErrors.position}>
                    <FormLabel>Position</FormLabel>
                    <Select
                        labelId="position-label"
                        id="position-select"
                        name="position"
                        value={formData.position}
                        required
                        disabled // Disable the Select to prevent user from changing it
                    >
                        {formData.systemSide === "Kitchen Side" && (
                        <MenuItem value="Kitchen Manager">Kitchen Manager</MenuItem>
                        )}
                        {formData.systemSide === "Dining Side" && (
                        <MenuItem value="Dining Manager">Dining Manager</MenuItem>
                        )}
                    </Select>
                    {formErrors.position && (
                        <FormHelperText>{formErrors.position}</FormHelperText>
                    )}
                    </FormControl>
                )}

                {/* Submit */}
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