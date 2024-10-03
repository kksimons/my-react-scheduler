


const DiningEmployeeList: React.FC<{ employees: any[] }> = ({ employees }) => {
    const diningEmployees = employees.filter(
      (employee) => employee.employee_system === "Dining Side"
    );
  
    return (
      <div className="employee-list-container">
        <h1>Dining Employees</h1>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Employee Type</th>
              <th>Available Shifts</th>
            </tr>
          </thead>
          <tbody>
            {diningEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.employee_fname}</td>
                <td>{employee.employee_lname}</td>
                <td>{employee.employee_dob}</td>
                <td>{employee.employee_phone_number}</td>
                <td>{employee.employee_position}</td>
                <td>{employee.employee_type}</td>
                <td>{employee.employee_availability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  export default DiningEmployeeList;