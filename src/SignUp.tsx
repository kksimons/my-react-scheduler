// SignUp.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { auth } from "./userAuth/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUserStore } from "./stores/useUserStore";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();
  const navigate = useNavigate();

  const { setRole: setUserRole, setProfilePic, setIsLoggedIn, setCurrentTab } = useUserStore();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const userData = {
        role: role, // 'employee' or 'employer'
        profilePic: null, // You can set a default picture URL if desired
        // Add other necessary fields here
      };

      // Determine Firestore collection based on role
      const collection = role === "employer" ? "employers" : "employees";

      // Create user document in Firestore
      await setDoc(doc(db, collection, user.uid), userData);

      // Update Zustand store
      setUserRole(role);
      setProfilePic(userData.profilePic);
      setIsLoggedIn(true);
      setCurrentTab(role === "employer" ? 1 : 1); // Adjust tabs as needed

      // Redirect to App or desired page
      navigate("/app"); // Adjust the route as per your routing setup
    } catch (err: any) {
      console.error("Error during sign-up:", err);
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 5,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Role</FormLabel>
          <RadioGroup
            row
            aria-label="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <FormControlLabel value="employee" control={<Radio />} label="Employee" />
            <FormControlLabel value="employer" control={<Radio />} label="Employer" />
          </RadioGroup>
        </FormControl>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUp;
