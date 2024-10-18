import React from 'react';
import { Box, Tabs, Tab } from "@mui/material";

interface NavBarProps {
  tabIndex: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ tabIndex, handleTabChange }) => {
  return (
    <Box className="employee-management-container" style={{ padding: "20px" }}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="All Employee" />
        <Tab label="Dining Employee" />
        <Tab label="Kitchen Employee" />
        <Tab label="Add Employee" />
        <Tab label="Schedule" />
      </Tabs>
    </Box>
  );
};

export default NavBar;