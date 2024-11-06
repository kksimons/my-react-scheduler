import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { useAuth } from "./userAuth/contexts/AuthContext";

// Select Role page starts here
export function SelectRole() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  // Handle select role, navigate based on the role selected
  const handleRoleSelection = (selectedRole) => {
    if (selectedRole === "Manager") {
      navigate("/ManagerSignUpPage"); // Navigate to manager sign-up page
    } else {
      navigate("/EmployeeSignUpPage"); // Navigate to employee sign-up page
    }
  };

  return (
    <Container>
      {/* Welcome Line */}
      <Typography variant="h3">Select your role:</Typography>

      <Button onClick={() => handleRoleSelection("/ManagerSignUpPage")}>Manager</Button>
      <Typography>Create efficient schedule and manage your employees</Typography>

      <Button onClick={() => handleRoleSelection("/EmployeeSignUpPage")}>Employee</Button>
      <Typography>View schedule, request shift, manage your availability</Typography>

    </Container>
  );
}

export default SelectRole;