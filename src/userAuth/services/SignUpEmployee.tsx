import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Updated interface to reflect the correct type for employeeAvailability
interface EmployeeData {
  employeeFname: string;
  employeeLname: string;
  employeeDOB: string;
  employeePhone: string;
  employeeEmail: string;
  employeeType: string;
  employeePosition: string;
  employeeSystem: string;
  employeeAvailability: {
    [key: string]: string[]; // Each day can have an array of strings for times
  };
}

// Function to sign up an employee and save employee data to Firestore
export const SignUpEmployee = async (
  {
    employeeFname, // First name
    employeeLname, // Last name
    employeeDOB, // Date of Birth
    employeePhone, // Phone Number
    employeeEmail, // Email
    employeeType, // Employment Type (Part-Time or Full-Time)
    employeePosition, // Position (e.g., Cook, Server, etc.)
    employeeSystem, // System (Kitchen Side or Dining Side)
    employeeAvailability // Correctly expecting an object with arrays of strings
  }: EmployeeData,
  employeePassword: string // Password
) => {
  try {
    // Create a new user using Firebase Auth
    const employeeCredential = await createUserWithEmailAndPassword(auth, employeeEmail, employeePassword);
    const employee = employeeCredential.user; // Contains the Firebase user data

    // Prepare employee data for Firestore, converting availability to a suitable format if needed
    const employeeData = { 
      employeeFname, 
      employeeLname, 
      employeeDOB, 
      employeePhone, 
      employeeEmail, 
      employeeType, 
      employeePosition, 
      employeeSystem, 
      employeeAvailability: JSON.stringify(employeeAvailability)  // Convert to JSON string if your database requires a string format
    };

    // Save employee data to Firestore in the 'employee-info' collection
    await setDoc(doc(db, "employee-info", employee.uid), employeeData);

    return employee;
  } catch (error) {
    console.error("Error during employee sign-up:", error);
    throw error;
  }
};
