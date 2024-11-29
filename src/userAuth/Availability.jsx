import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid2,
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
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", padding: 2, backgroundColor: "#c4c4ff" }}
    >
      <Grid2 item xs={12} sm={10} md={8} lg={6}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box sx={{ marginBottom: 3, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom sx={{color:"#2b2b2b"}}>
              Set Your Availability
            </Typography>
            {/* //use hex for later pls im ded  */}
            <Typography variant="body1" color="textSecondary"> 
              Please select your availability and preferable shift timings for each
              day of the week.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              {days.map((day) => (
                <Grid2 item xs={12} sm={6} key={day}>
                  <FormControl
                    component="fieldset"
                    sx={{
                      width: "100%",
                      padding: 2,
                      border: "1px solid #4314ff",
                      borderRadius: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <FormLabel
                      component="legend"
                      required
                      sx={{ mb: 1, fontWeight: "bold", color: "#2b2b2b" }}
                    >
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
                              sx={{
                                color: "#4314ff",
                                "&.Mui-checked": {
                                  color: "#4314ff",
                                },
                              }}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid2>
              ))}
            </Grid2>
            <Button
              type="submit"
              variant="contained"
              width="500" //doesnt work 
              sx={{
                marginTop: 4,
                padding: 1.5,
                backgroundColor: "#4314ff",
                color: "white" ,
                fontSize: "16px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#2613f3",
                },
                boxShadow: 2,
              }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Availability;