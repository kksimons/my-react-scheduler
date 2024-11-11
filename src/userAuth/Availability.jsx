import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import { getFirestore, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Availability = () => {

    const navigate = useNavigate();
    const db = getFirestore();
    
    // Set the initial availability state
    const [availability, setAvailability] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });

    // Set the initial form error state
    const [formError, setFormError] = useState("");

    // Define the days of the week and availability options
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const options = ["Opening", "Closing", "Evening", "Anytime", "Unavailable"];


    // Fetch the availability from the database when the component mounts
    useEffect(() => {
        const fetchAvailability = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "employees", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.availability) {
                        setAvailability(data.availability);
                    }
                }
            }
        };
    
        fetchAvailability();
    }, [db]);
    
    //handle change function: if choose anytime, remove other options. 
    //if choose unavailable, remove other options
    const handleChange = (day, option) => {
        setAvailability(prevState => {
            const dayAvailability = prevState[day];
            if (option === "Anytime" || option === "Unavailable") {
                return {
                    ...prevState,
                    [day]: dayAvailability.includes(option) ? [] : [option]
                };
            } else {
                const newAvailability = dayAvailability.includes(option)
                    ? dayAvailability.filter(item => item !== option)
                    : [...dayAvailability, option].filter(item => item !== "Anytime" && item !== "Unavailable");
                return {
                    ...prevState,
                    [day]: newAvailability
                };
            }
        });
    };

    //handle submit function
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Reset error message
        setFormError("");

        // Check if at least one option is selected for each day
        const daysWithNoSelection = days.filter(day => availability[day].length === 0);
        
        // If any day has no selection, show an error message and prevent submission
        if (daysWithNoSelection.length > 0) {
            setFormError("Please select at least one option for each day.");
            return; // Prevent submission
        }

        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, "employees", user.uid), { availability });
                toast.success("Availability has been saved");
                navigate("/EmployeeDashboard");
            } catch (error) {
                console.error("Error saving availability: ", error);
                toast.error("Error saving availability");
            }
        } else {
            console.error("No user is signed in");
            toast.error("Your account has not been create yet, please sign up first");
            navigate("/SignUp");
        }
    };
    
    return (
        <Box 
            // maxWidth="sm"
            sx={{ 
            }} 
            >
            <Typography variant="h4" gutterBottom align="center">
                Set Your Availability
            </Typography>
            <Typography>
                Please select your availability and preferable shift timings for each day of the week.
            </Typography> 
            {formError && <Typography color="error" align="center">{formError}</Typography>}
            <br />
            <form onSubmit={handleSubmit}>
                {days.map(day => (
                    <FormControl component="fieldset" key={day} sx={{  }}>
                        <FormLabel component="legend" required>{day}</FormLabel>
                        <FormGroup>
                            {options.map(option => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Checkbox
                                            checked={availability[day].includes(option)}
                                            onChange={() => handleChange(day, option)}
                                            name={option}
                                           
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                ))}
                <Button
                //onClick= { handleSubmit }
                 type="submit" 
                 variant="contained"
                 fullWidth>
                    Submit
                </Button>
            </form>
            <ToastContainer />
        </Box>
    );
};

export default Availability;
