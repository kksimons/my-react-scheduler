// src/userAuth/ManagerSignIn/ForgotPassword.jsx

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    // Send new password to email
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Forgot Password
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handlePasswordReset} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Sending...' : 'Send Password Reset Email'}
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
