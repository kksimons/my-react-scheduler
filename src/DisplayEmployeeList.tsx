import React from 'react';
import { useLocation } from 'react-router-dom';

// Define the props type for EmployeeList
interface Employee {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  employeeType: string;
  position: string;
  availableShift: string;
}

const DisplayEmployeeList: React.FC = () => {
  const location = useLocation();
  const { employees } = location.state || { employees: [] }; // Extract employees from state or set empty array

  return (
    <div className='employee-list-container'>
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
          {employees.map((employee: Employee, index: number) => (
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
  );
};

export default DisplayEmployeeList;
