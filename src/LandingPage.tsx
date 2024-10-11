import React from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();

  const handleRoleSelection = (role) => {
    if (role === 'Manager') {
      history.push('/manager');
    } else {
      history.push('/employee');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to PowerShift</h1>
      <p>Please select your role:</p>
      <button 
        onClick={() => handleRoleSelection('Manager')} 
        style={{ margin: '10px', padding: '10px 20px' }}
      >
        Manager
      </button>
      <button 
        onClick={() => handleRoleSelection('Employee')} 
        style={{ margin: '10px', padding: '10px 20px' }}
      >
        Employee
      </button>
    </div>
  );
};

export default LandingPage;
