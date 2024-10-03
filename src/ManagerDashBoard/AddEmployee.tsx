// THIS PAGE WILL DO: 
// 1. Add new employees to table list 
// 2. It will auto fetching data from firebase database and auto update and display on our table (w/o manually reload the page by using CALL BACK )


import React, { useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, addDoc } from "firebase/firestore";
import Select from "react-select"; //react select for multi select
// import "./AddEmployee.css"; 


//set value form 
interface AddEmployeeProps {
  onEmployeeAdded: () => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onEmployeeAdded }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    employeeType: "",
    position: "",
    availableShift: "",
  });

  // Firestore Collection Reference
  const employeesCollectionRef = collection(db, "employee-info");

  // handle form input changes
  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // function to handle changes for the multi-select component (availability section) 
  const handleMultiSelectChange = (selectedOptions: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      availableShift: selectedOptions
        ? selectedOptions.map((option: any) => option.value).join(", ")
        : "",
    }));
  };

    // Function to capitalize the first letter of each word
  const capitalize = (str: string) => {
    return str
      .toLowerCase() // First, convert the entire string to lowercase to handle cases where the input is in uppercase.
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word.
  };   //Since i have found a way to capitalize which is to capitalize the value. idk if this funct is still nessessary but seems like a good practice ig 



  // Handle form submission to add a new employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



  // Employee data object to be saved in Firestore with capitalized fields (anything with text be cap)
  const employeeData  = {
    employee_fname: capitalize(values.firstName),
    employee_lname: capitalize(values.lastName),
    employee_dob: values.dob, 
    employee_phone_number: values.phone, 
    employee_position: capitalize(values.position),
    employee_type: capitalize(values.employeeType),
    employee_system: values.position === "Cook" ? "Kitchen Side" : "Dining Side", // Automatically derive
    employee_availability: capitalize(values.availableShift), 
  };

  try {
    // Add new employee data to Firestore
    const docRef = await addDoc(employeesCollectionRef, employeeData);
    const newEmployee = { id: docRef.id, ...employeeData };

    // Alert when a new employee is added
    window.alert(`New employee ${capitalize(values.firstName)} ${capitalize(values.lastName)} has been added.`);

    // Callback. The reason why it's here is because new added employee will not be auto display on the list, and we have to reload manually. Callback from EmployeeManagement down to AddEmployee
    onEmployeeAdded(newEmployee);


    // Reset form values after submission
    setValues({
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      employeeType: "",
      position: "",
      availableShift: "",
    });

    fetchEmployeeList();
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};


  // Shift options for availability
  const shiftOptions = [
    { value: "Morning", label: "Morning" },
    { value: "Evening", label: "Evening" },
    { value: "Closing", label: "Closing" },
    { value: "Anytime", label: "Anytime" },
  ];

  return (
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

          {/* Last Name */}
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

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob">Date of Birth*</label>
            <input
              type="date"
              name="dob"
              onChange={handleChanges}
              required
              value={values.dob}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              name="phone"
              onChange={handleChanges}
              required
              value={values.phone}
            />
          </div>

          {/* Employee Type */}
          <div>
            <label htmlFor="employeeType">Employee Type*</label>
            <select
              name="employeeType"
              onChange={handleChanges}
              value={values.employeeType}
              required
            >
              <option value="">Select Employee Type*</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position">Position*</label>
            <select
              name="position"
              onChange={handleChanges}
              value={values.position}
              required
            >
              <option value="">Select Position*</option>
              <option value="Cook">Cook</option>
              <option value="Busser">Busser</option>
              <option value="Server">Server</option>
              <option value="Host">Host</option>
            </select>
          </div>

          {/* Availability (Multiple Selection Possible) */}
          <div>
            <label htmlFor="availableShift">Available Shifts*</label>
            <Select
              isMulti
              name="availableShift"
              options={shiftOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={shiftOptions.filter((option) =>
                values.availableShift.includes(option.value)
              )}
              onChange={handleMultiSelectChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="button-style">
            <button type="submit">Add Employee*</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
function fetchEmployeeList() {
  throw new Error("Function not implemented.");
}

