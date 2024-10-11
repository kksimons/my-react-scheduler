// src/pages/LandingPage.tsx
import React, { useState } from "react";
import { Box, Button, Typography, Paper, Avatar } from "@mui/material";
import SignUpUser from "../userAuth/services/authService";

const LandingPage: React.FC = () => {
  const [role, setRole] = useState<"manager" | "employee" | null>(null);

  // Handle role selection
  const handleRoleSelection = (selectedRole: "manager" | "employee") => {
    setRole(selectedRole);
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
      {!role ? (
        <>
          {/* Welcome Message */}
          <Typography variant="h3" sx={{ mb: 4 }}>
            Welcome To Power Shift
          </Typography>

          {/* Role Selection */}
          <Paper elevation={3} sx={{ padding: 4, width: "500px" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Your Role
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRoleSelection("manager")}
              >
                Manager
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRoleSelection("employee")}
              >
                Employee
              </Button>
            </Box>
          </Paper>
        </>
      ) : (
        // If role is selected, render the signup form based on role
        <SignUpUser role={role} />
      )}
    </Box>
  );
};

export default LandingPage;
