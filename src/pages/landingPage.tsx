// src/pages/LandingPage.tsx
import React, { useState } from "react";
import { Box, Button, Typography, Paper, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import signUpUser from "../userAuth/services/authService";

const LandingPage: React.FC = () => {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [role, setRole] = useState<"manager" | "employee" | null>(null);

  // Handle showing the dialog to choose role after clicking "Start"
  const handleStart = () => {
    setShowRoleDialog(true); // Open the dialog for role selection
  };

  // Handle role selection (Manager or Employee)
  const handleRoleSelection = (selectedRole: "manager" | "employee") => {
    setRole(selectedRole);  // Set the selected role
    setShowRoleDialog(false); // Close the dialog after selection
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {/* Landing Page Message */}
      <Typography variant="h3" sx={{ mb: 4 }}>
        Welcome To Power Shift
      </Typography>

      {/* Start Button */}
      <Button variant="contained" color="primary" onClick={handleStart}>
        Start
      </Button>

      {/* Show Sign-Up Form if role is selected */}
      {role && <signUpUser role={role} />}

      {/* Dialog for selecting Manager or Employee */}
      <Dialog open={showRoleDialog} onClose={() => setShowRoleDialog(false)}>
        <DialogTitle>Choose Your Role</DialogTitle>
        <DialogContent>
          <DialogContentText>Select whether you are a Manager or an Employee.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRoleSelection("manager")} color="primary">
            Manager
          </Button>
          <Button onClick={() => handleRoleSelection("employee")} color="secondary">
            Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
