import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button
} from "@mui/material";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Availability = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  const initialAvailability = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };
  
  const [availability, setAvailability] = useState(initialAvailability);
  
  // Define array  the days of the week and availability options
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const options = [
    "Opening",
    "Closing",
    "Evening",
    "Anytime",
    "Unavailable",
  ];

  //I have mount issue here 
  // Fetch the availability from the database when the component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        try {
            const docRef = doc(db, "employees", user.uid); // Get the document reference
            const docSnap = await getDoc(docRef); // Get the document snapshot

            if (docSnap.exists()) { //if doc exists 
            const data = docSnap.data(); //then get the data from the doc
            if (data.availability) { //if data has availability
                setAvailability({ //pre is the previous state (when not set) 
                    ...initialAvailability, //spread to the initial state 
                    ...data.availability //to the data from the doc 
                }); //then set the availability
            }
            }
        } catch (error) {
            console.error("Error fetching availability: ", error);
            toast.error("Error accessing and grabbing availability data"); 
        }
      } else {
        // If no user is signed in, show an error toast 
        console.error("No user is signed in");
        try {
            toast.error("Your account has not been created yet to access this page, please sign up first");
            navigate("/SignUp");
        } catch (error) {
            console.error("Error navigating to sign up page: ", error);
            toast.error("Error navigating to sign up page");
        }
      }
    };

    fetchAvailability();
  }, [db]);

  // Handle change function: if choose anytime, remove other options. 
  // if choose unavailable, remove other options
  const handleChange = (day, option) => {
    setAvailability((prevState) => {
      const dayAvailability = prevState[day];
      if (option === "Anytime" || option === "Unavailable") {
        return {
          ...prevState,
          [day]: dayAvailability.includes(option) ? [] : [option]
        };
      } else {
        const newAvailability = dayAvailability.includes(option)
          ? dayAvailability.filter((item) => item !== option)
          : [...dayAvailability, option].filter(
              (item) => item !== "Anytime" && item !== "Unavailable"
            );
        return {
          ...prevState,
          [day]: newAvailability
        };
      }
    });
  };

  // Handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one option is selected for each day
    const daysWithNoSelection = days.filter(
      (day) => availability[day].length === 0
    );

    // If any day has no selection, show an error toast and prevent submission
    if (daysWithNoSelection.length > 0) {
      toast.error("Please select at least one option for each day.");
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
      toast.error(
        "Your account has not been created yet, please sign up first"
      );
      navigate("/SignUp");
    }
  };

  return (
    <Box
      // maxWidth="sm"
      sx={{ padding: 2 }} 
    >
      <Typography variant="h4" gutterBottom align="center">
        Set Your Availability
      </Typography>
      <Typography>
        Please select your availability and preferable shift timings for each
        day of the week.
      </Typography>
      <br />
      <form onSubmit={handleSubmit}>
        {days.map((day) => (
          <FormControl
            component="fieldset"
            key={day}
            sx={{ marginBottom: 2 }} 
          >
            <FormLabel component="legend" required>
              {day}
            </FormLabel>
            <FormGroup>
              {options.map((option) => (
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
          fullWidth
          sx={{ marginTop: 2 }} 
        >
          Submit
        </Button>
      </form>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </Box>
  );
};

export default Availability;