import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectRole = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === 'Employer') {
      navigate('/EmployerRegistrationPage'); // Direct to Employer form
    } else {
      navigate('/EmployeeRegistrationPage'); // Direct to Employee form
    }
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => handleRoleSelection('Employer')}>Employer</button>
      <button onClick={() => handleRoleSelection('Employee')}>Employee</button>
    </div>
  );
};

export default SelectRole;
