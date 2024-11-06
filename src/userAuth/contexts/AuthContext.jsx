// // src/userAuth/contexts/AuthContext.js

// import React, { createContext, useContext } from 'react';
// // import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../firebase';

// const AuthContext = createContext(undefined);

// export const AuthProvider = ({ children }) => {
//   const [user, loading, error] = useAuthState(auth); // Assuming you import `useAuthState` if it's uncommented
//   const [role, setRole] = useState(null); // New role state for role selection
//   return (
//     <AuthContext.Provider value={{ user: user ?? null, loading, error, role, setRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Temporary placeholder function for `useAuthState` 
// function useAuthState(auth) {
//   // Placeholder to avoid errors, you should uncomment the real `useAuthState` import when using react-firebase-hooks
//   return [null, false, null];
// }
import React, { createContext, useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth); // This now connects to Firebase authentication
  const [role, setRole] = useState(null); // New role state for role selection

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading, error, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
