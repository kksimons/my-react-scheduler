import React, { useState } from "react";
import { Container, Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Availability = () => {
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
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "employees"), availability);
            alert("Employee account has created");
            setTimeout(() => {
                alert("You account has been created");
                setLoading(false);
                // Redirect to Employee Dashboard
                window.location.href = "/SignIn"; //Returns the Location object's URL. Can be set, to navigate to the given URL.
            }, 2000);
        } catch (error) {
            console.error("Error saving availability: ", error);
            setLoading(false);
        }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const options = ["Opening", "Closing", "Evening", "Anytime"];

    return (
        <Container maxWidth="sm">
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
                 onClick={handleSubmit} 
                 fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default Availability;
