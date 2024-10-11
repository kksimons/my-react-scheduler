import * as React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleLogin = () => {
    if (password === 'password') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

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
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Admin Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          helperText={error ? 'Incorrect password' : ''}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleLogin} fullWidth>
          Sign In
        </Button>
        <Button onClick={onBack} sx={{ marginTop: 2 }}>
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
