import React, { useState } from 'react'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

export default function HomePage() {
  const db = getFirestore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameLogin = async (e) => {
    e.preventDefault();
    try {
      const userReference = doc(db, 'users', username);
      const userDoc = await getDoc(userReference);

      if (userDoc.exists()) {
        const tempEmail = `${username}@example.com`;
        await signInWithEmailAndPassword(auth, tempEmail, password);
        // Redirect or show success message (e.g., navigate to the dashboard)
      } else {
        setError('User not found');
      }
    } catch (error) {
      setError((error as any).message || String(error));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
      <Paper elevation={3} sx={{ padding: 3, width: '300px' }}>
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleUsernameLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}



