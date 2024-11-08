import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectRole = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === 'Employer') {
      navigate('/EmployerRegistration'); // Direct to Employer form
    } else if (role === 'Employee') {
      navigate('/EmployeeRegistration'); // Direct to Employee form
    } else {
      console.error('Invalid role selected');
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
