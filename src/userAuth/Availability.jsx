import React, { useState } from "react";
import { Box, Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import { getFirestore, setDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const Availability = () => {

    
    const navigate = useNavigate();
    

    const [availability, setAvailability] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });

    const db = getFirestore();

    const handleChange = (day, option) => {
        setAvailability(prevState => {
            const dayAvailability = prevState[day];
            if (option === "Anytime") {
                return {
                    ...prevState,
                    [day]: dayAvailability.includes("Anytime") ? [] : ["Anytime"]
                };
            } else {
                const newAvailability = dayAvailability.includes(option)
                    ? dayAvailability.filter(item => item !== option)
                    : [...dayAvailability, option].filter(item => item !== "Anytime");
                return {
                    ...prevState,
                    [day]: newAvailability
                };
            }
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault;
        const user = auth.currentUser;
    
        if (user) {
            try {
                await updateDoc(doc(db, "employees", user.uid), { availability });
                alert("Availability has been saved");
                navigate("/EmployeeDashBoard");
            } catch (error) {
                console.error("Error saving availability: ", error);
            }
        } else {
            console.error("No user is signed in");
            navigate("/SignIn");
        }
    };
    

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const options = ["Opening", "Closing", "Evening", "Anytime"];

    return (
        <Box 
            maxWidth="sm"
            sx={{ 
                onclick: { handleSubmit }
            }} 
            >
            <Typography variant="h4" gutterBottom align="center">
                Set Your Availability
            </Typography>
            <form onSubmit={handleSubmit}>
                {days.map(day => (
                    <FormControl component="fieldset" key={day} sx={{ marginBottom: 2 }}>
                        <FormLabel component="legend">{day}</FormLabel>
                        <FormGroup row>
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
                 type="submit" 
                 variant="contained"
                 fullWidth>
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default Availability;
