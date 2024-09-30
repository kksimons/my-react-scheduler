import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      // Look up the user by username
      const userReference = doc(db, "users", username); // Assuming username is stored as document ID
      const userDoc = await getDoc(userReference);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const tempEmail = `${username}@example.com`; // Use the same temp email format as registration
        

        // Sign in with the temporary email
        await signInWithEmailAndPassword(auth, tempEmail, password);

        // Redirect or show success message (e.g., navigate to the dashboard)
      } 
      else {
        setError('User not found');
      }
    } 
    catch (error) {
      setError((error as Error).message || String(error));
    }
  };

  return (
    <body className="login-body">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form className="login-form" onSubmit={handleUsernameLogin}>
          <div className="login-field">
            <label className="login-label">Username:</label>
            <input
              className="login-input"
              placeholder='Enter Username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password:</label>
            <input
              className="login-input"
              placeholder='Enter Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </body>
  );
};

export default Login;