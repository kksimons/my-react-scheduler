import React, { useEffect, useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import Select from "react-select";
import { Button } from "@mui/material";

// Define the props interface for the component
interface AddEmployeeProps {
  onEmployeeAdded: (newEmployee: any) => void;
  onEmployeeUpdated: (updatedEmployee: any) => void;
  initialData?: any;
}

// Define the form values interface
interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  employeeType: string;
  position: string;
  availableShift: string;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  onEmployeeAdded,
  onEmployeeUpdated,
  initialData,
}) => {
  // Initialize form values
  const [values, setValues] = useState<FormValues>({
    firstName: initialData?.employee_fname || "",
    lastName: initialData?.employee_lname || "",
    dob: initialData?.employee_dob || "",
    phone: initialData?.employee_phone_number || "",
    employeeType: initialData?.employee_type || "",
    position: initialData?.employee_position || "",
    availableShift: initialData?.employee_availability || "",
  });

  // Firestore Collection Reference
  const employeesCollectionRef = collection(db, "employees");

  // Handle form input changes
  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle multi-select changes for availability
  const handleMultiSelectChange = (selectedOptions: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      availableShift: selectedOptions
        ? selectedOptions.map((option: any) => option.value).join(", ")
        : "",
    }));
  };

  // Capitalize the first letter of each word
  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare employee data for Firestore
    const employeeData = {
      employee_fname: capitalize(values.firstName),
      employee_lname: capitalize(values.lastName),
      employee_dob: values.dob,
      employee_phone_number: values.phone,
      employee_position: capitalize(values.position),
      employee_type: capitalize(values.employeeType),
      employee_system:
        values.position === "Cook" ? "Kitchen Side" : "Dining Side",
      employee_availability: capitalize(values.availableShift),
    };

    try {
      if (initialData) {
        await updateDoc(doc(db, "employees", initialData.id), employeeData);
        const updateEmployee = { id: initialData.id, ...employeeData };
        onEmployeeUpdated(updateEmployee);

        // Alert for successful update
        window.alert(
          `Employee ${employeeData.employee_fname} ${employeeData.employee_lname} has been updated.`
        );
      } else {
        // Add new employee to Firestore
        const docRef = await addDoc(employeesCollectionRef, employeeData);
        const newEmployee = { id: docRef.id, ...employeeData };

        // Alert user of successful addition
        window.alert(
          `New employee ${employeeData.employee_fname} ${employeeData.employee_lname} has been added.`
        );

        // Callback to parent component
        onEmployeeAdded(newEmployee);
      }

      // Reset form values
      //   setValues({
      //     firstName: "",
      //     lastName: "",
      //     dob: "",
      //     phone: "",
      //     employeeType: "",
      //     position: "",
      //     availableShift: "",
      //   });

      // Fetch updated employee list (function to be implemented)
      // fetchEmployeeList();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Update values when initialData changes
  useEffect(() => {
    if (initialData) {
      setValues({
        firstName: initialData.employee_fname || "",
        lastName: initialData.employee_lname || "",
        dob: initialData.employee_dob || "",
        phone: initialData.employee_phone_number || "",
        employeeType: initialData.employee_type || "",
        position: initialData.employee_position || "",
        availableShift: initialData.employee_availability || "",
      });
    }
  }, [initialData]);

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
          {/* Form fields */}
          <FormField
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChanges}
            required
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChanges}
            required
          />
          <FormField
            label="Date of Birth"
            name="dob"
            type="date"
            value={values.dob}
            onChange={handleChanges}
            required
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChanges}
            required
          />

          {/* Employee Type dropdown */}
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

          {/* Position dropdown */}
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

          {/* Available Shifts multi-select */}
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {initialData ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component for form fields
const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, name, type = "text", value, onChange, required }) => (
  <div>
    <label htmlFor={name}>{label}*</label>
    <input
      type={type}
      placeholder={`Enter ${label}`}
      name={name}
      onChange={onChange}
      required={required}
      value={value}
    />
  </div>
);

export default AddEmployee;
