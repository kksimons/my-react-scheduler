import React, { useEffect, useState } from "react";
import { db } from "../userAuth/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Button, Box, CssBaseline, Paper, Typography, ThemeProvider } from "@mui/material";
import CustomTheme from "../customtheme";

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
  const [values, setValues] = useState<FormValues>({
    firstName: initialData?.employee_fname || "",
    lastName: initialData?.employee_lname || "",
    dob: initialData?.employee_dob || "",
    phone: initialData?.employee_phone_number || "",
    employeeType: initialData?.employee_type || "",
    position: initialData?.employee_position || "",
    availableShift: initialData?.employee_availability || "",
  });

  const employeesCollectionRef = collection(db, "employees"); 

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      availableShift: selectedOptions
        ? selectedOptions.map((option: any) => option.value).join(", ")
        : "",
    }));
  };

  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const employeeData = {
      employee_fname: capitalize(values.firstName),
      employee_lname: capitalize(values.lastName),
      employee_dob: values.dob,
      employee_phone_number: values.phone,
      employee_position: capitalize(values.position),
      employee_type: capitalize(values.employeeType),
      employee_system: values.position === "Cook" ? "Kitchen Side" : "Dining Side",
      employee_availability: capitalize(values.availableShift),
    };

    try {
      if (initialData) {
        await updateDoc(doc(db, "employee-info", initialData.id), employeeData);
        onEmployeeUpdated({ id: initialData.id, ...employeeData });
        window.alert(`Employee ${employeeData.employee_fname} ${employeeData.employee_lname} has been updated.`);
      } else {
        const docRef = await addDoc(employeesCollectionRef, employeeData);
        onEmployeeAdded({ id: docRef.id, ...employeeData });
        window.alert(`New employee ${employeeData.employee_fname} ${employeeData.employee_lname} has been added.`);
      }
      // Reset form values can go here if needed.
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

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

  const shiftOptions = [
    { value: "Morning", label: "Morning" },
    { value: "Evening", label: "Evening" },
    { value: "Closing", label: "Closing" },
    { value: "Anytime", label: "Anytime" },
  ];

  return (
    <ThemeProvider theme={CustomTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <Paper elevation={3} sx={{ maxWidth: 600, p: 4, borderRadius: 2 }}>
          <Typography variant="h5" color="primary.dark" gutterBottom>
            {initialData ? "Edit Employee" : "Add New Employee"}
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <FormField label="First Name" name="firstName" value={values.firstName} onChange={handleChanges} required />
            <FormField label="Last Name" name="lastName" value={values.lastName} onChange={handleChanges} required />
            <FormField label="Date of Birth" name="dob" type="date" value={values.dob} onChange={handleChanges} required />
            <FormField label="Phone Number" name="phone" type="tel" value={values.phone} onChange={handleChanges} required />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Employee Type</Typography>
              <select name="employeeType" onChange={handleChanges} value={values.employeeType} required style={{ padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}>
                <option value="">Select Employee Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
              </select>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Position</Typography>
              <select name="position" onChange={handleChanges} value={values.position} required style={{ padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}>
                <option value="">Select Position</option>
                <option value="Cook">Cook</option>
                <option value="Busser">Busser</option>
                <option value="Server">Server</option>
                <option value="Host">Host</option>
              </select>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Available Shifts</Typography>
              <Select
                isMulti
                name="availableShift"
                options={shiftOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={shiftOptions.filter(option => values.availableShift.includes(option.value))}
                onChange={handleMultiSelectChange}
                required
              />
            </Box>

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              {initialData ? "Update Employee" : "Add Employee"}
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
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
  <Box sx={{ mt: 2 }}>
    <Typography variant="body1" sx={{ mb: 1 }}>{label}</Typography>
    <input
      type={type}
      placeholder={`Enter ${label}`}
      name={name}
      onChange={onChange}
      required={required}
      value={value}
      style={{ padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}
    />
  </Box>
);

export default AddEmployee;
