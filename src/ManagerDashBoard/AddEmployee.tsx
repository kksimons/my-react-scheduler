
import React, { useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, addDoc } from "firebase/firestore";
import Select from "react-select"; //react select for multi select
// import "./AddEmployee.css"; 


//set value form 
const AddEmployee: React.FC = () => {
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

  // function to handle changes for the multi-select component
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
};

// Handle form submission to add a new employee
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Employee data object to be saved in Firestore with capitalized fields
  const employeeData = {
    employee_fname: capitalize(values.firstName),
    employee_lname: capitalize(values.lastName),
    employee_dob: values.dob, // Keeping date as is since it does not need capitalization
    employee_phone_number: values.phone, // Phone numbers do not need capitalization
    employee_position: capitalize(values.position),
    employee_type: capitalize(values.employeeType),
    employee_system: values.position === "cook" ? "kitchen" : "dining Side", // Automatically derive and capitalize based on position
    employee_availability: capitalize(values.availableShift), // Capitalize shift availability if needed
  };

  try {
    // Add new employee data to Firestore
    await addDoc(employeesCollectionRef, employeeData);

    // Alert when a new employee is added
    window.alert(`New employee ${capitalize(values.firstName)} ${capitalize(values.lastName)} has been added.`);

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
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};


  // Shift options for availability
  const shiftOptions = [
    { value: "morning", label: "Morning" },
    { value: "evening", label: "Evening" },
    { value: "closing", label: "Closing" },
    { value: "anytime", label: "Anytime" },
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
              <option value="cook">Cook</option>
              <option value="busser">Busser</option>
              <option value="server">Server</option>
              <option value="host">Host</option>
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
