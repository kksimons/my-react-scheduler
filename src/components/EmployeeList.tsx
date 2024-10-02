import React, { useEffect, useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, getDocs } from "firebase/firestore";

// import "./styles/EmployeeList.css";

interface Employee {
  id: string;
  employee_fname: string;
  employee_lname: string;
  employee_phone_number: string;
  employee_position: string;
  employee_type: string;
  employee_availability: string;
}

interface EmployeeListProps {
  onEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onEdit }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Firestore Collection Reference
  const employeesCollectionRef = collection(db, "employee-info");

  // Fetch employees from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getDocs(employeesCollectionRef);
        setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Employee));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="employee-list-container">
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Type</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employee_fname}</td>
              <td>{employee.employee_lname}</td>
              <td>{employee.employee_phone_number}</td>
              <td>{employee.employee_position}</td>
              <td>{employee.employee_type}</td>
              <td>{employee.employee_availability}</td>
              <td>
                <button onClick={() => onEdit(employee)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
