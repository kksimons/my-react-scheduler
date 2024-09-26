import React, { useState } from 'react';
import './App.css';

function ScheduleForm() {
  const [values, setValues] = useState({
    employeeCount: '',
    shiftsPerDay: '',
    totalDays: '',
    employeeType: '',
  });

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(values);
  };

  const resetForm = () => {
    setValues({
      employeeCount: '',
      shiftsPerDay: '',
      totalDays: '',
      employeeType: '',
    });
  };

  return (
    <div className="schedule-container">
      <h1>Schedule Details</h1>
      <div className='schedule-form'> 
        <form onSubmit={handleSubmit}>
          <label htmlFor="employeeCount">Number of Employees*</label>
          <input
            type="text"
            placeholder="Enter Number"
            name="employeeCount"
            onChange={handleChanges}
            required
            value={values.employeeCount}
          />

          <label htmlFor="shiftsPerDay">Shifts Per Day*</label>
          <input
            type="text"
            placeholder="Enter Number"
            name="shiftsPerDay"
            onChange={handleChanges}
            required
            value={values.shiftsPerDay}
          />

          <label htmlFor="totalDays">Total Days*</label>
          <input
            type="text"
            placeholder="Enter Total Days"
            name="totalDays"
            onChange={handleChanges}
            required
            value={values.totalDays}
          />

          <label htmlFor="employeeType">Employee Type*</label>
          <select
            name="employeeType"
            id="type"
            onChange={handleChanges}
            value={values.employeeType}
          >
            <option value="">Select Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
          </select>

          <button type="reset" onClick={resetForm}>
            Reset
          </button>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleForm;
