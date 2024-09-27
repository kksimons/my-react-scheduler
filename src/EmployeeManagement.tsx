import React, { useState } from 'react';
import DisplayEmployeeList from './DisplayEmployeeList';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import './EmployeeManagement.css'; // Import the CSS file for EmployeeManagement

// Initial JSON data of employees
const initialEmployees = [
  {
    firstName: "John",
    lastName: "Doe",
    gender: "male",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    employeeType: "Full Time",
    position: "Server",
    availableShift: "Opening"
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    gender: "female",
    email: "jane.smith@example.com",
    phone: "123-555-7890",
    employeeType: "Part Time",
    position: "Host",
    availableShift: "Evening"
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    gender: "male",
    email: "robert.johnson@example.com",
    phone: "321-456-7890",
    employeeType: "Full Time",
    position: "Busser",
    availableShift: "Closing"
  },
];

function EmployeeManagement() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phone: '',
    employeeType: '',
    position: '',
    availableShift: ''
  });


  // e stands for each employee 
  const [employees, setEmployees] = useState(initialEmployees);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEmployees([...employees, values]);

    // alert when a new employee is added
    window.alert(`New employee ${values.firstName} ${values.lastName} has been added.`);

    setValues({
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      phone: '',
      employeeType: '',
      position: '',
      availableShift: ''
    });
  };

  return (
    <div className="employee-management-container">

      <div className="add-employee-container">

      <h1>Add New Employee</h1>

        <div className="add-employee-form-container">

          <form onSubmit={handleSubmit}>

            {/* First Name */}
            <div>
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                onChange={handleChanges}
                required
                value={values.firstName}
              />
            </div>

            {/* Last name */}
            <div>
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                onChange={handleChanges}
                required
                value={values.lastName}
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender">Gender*</label>

              <div className='employee-gender-select-container'> 
                <select name="gender" onChange={handleChanges} value={values.gender} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={handleChanges}
                required
                value={values.email}
              />
            </div>

            {/* Phone number */}
            <div>
              <label htmlFor="phone">Phone*</label>
              <input
                type="tel"
                placeholder="Enter Phone"
                name="phone"
                onChange={handleChanges}
                required
                value={values.phone}
              />
            </div>

            {/* Employee type: full-time, part-time, contract */}
            <div>
              <label htmlFor="employeeType">Employee Type*</label>
              <select name="employeeType" onChange={handleChanges} value={values.employeeType} required>
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Position: server, busser, host */}
            <div>
              <label htmlFor="position">Position*</label>
              <select name="position" onChange={handleChanges} value={values.position} required>
                <option value="">Select Position</option>
                <option value="Server">Server</option>
                <option value="Busser">Busser</option>
                <option value="Host">Host</option>
              </select>
            </div>

            {/* Position: opening, evening, closing */}
            <div>
              <label htmlFor="availableShift">Available Shift*</label>
              <select name="availableShift" onChange={handleChanges} value={values.availableShift} required>
                <option value="">Select Shift</option>
                <option value="Opening">Opening</option>
                <option value="Evening">Evening</option>
                <option value="Closing">Closing</option>
              </select>
            </div>

            {/* ADD EMPLOYEE BUTTON */}
            <div className='add-employee-button-container'> 
            <button type="submit">Add Employee</button>
            </div>

          </form>

        </div>

      </div>

      {/* EMPLOYEE TABLE */}
      <div className="employee-table-container">

        <h2>Employee List</h2>

        <table className="employee-table">

          <thead>

            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Position</th>
              <th>Shift</th>
              <th>Employee Type</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>

          </thead>

          <tbody>
            {/* ADD ONE ROW FOR EVERY EMPLOYEE */}
            {employees.map((employee, index) => (

              <tr key={index}>

                <td>{index + 1}</td>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.position}</td>
                <td>{employee.availableShift}</td>
                <td>{employee.employeeType}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                
              </tr>

            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EmployeeManagement;
