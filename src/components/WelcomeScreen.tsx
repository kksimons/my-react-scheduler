import * as React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

interface WelcomeScreenProps {
  onRoleSelect: (role: 'manager' | 'employee') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRoleSelect }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to PowerShift!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Start creating your schedule.
        </Typography>
        <Button
          variant="contained"
          onClick={() => onRoleSelect('manager')}
          sx={{ margin: 2 }}
        >
          I'm a Manager
        </Button>
        <Button
          variant="outlined"
          onClick={() => onRoleSelect('employee')}
          sx={{ margin: 2 }}
        >
          I'm an Employee
        </Button>
      </Paper>
    </Box>
  );
};

export default WelcomeScreen;
