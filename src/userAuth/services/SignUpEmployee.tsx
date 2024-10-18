// src/userAuth/services/SignUpEmployee.ts

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { EmployeeData } from "../../components/EmployeeData"; // Import full EmployeeData interface

export const SignUpEmployee = async (
  employeeData: EmployeeData,  // Full EmployeeData
  employeePassword: string  // Password
) => {
  try {
    const employeeCredential = await createUserWithEmailAndPassword(auth, employeeData.employeeEmail, employeePassword);
    const employee = employeeCredential.user;

    // Save employee data to Firestore (adjust as necessary for your structure)
    await setDoc(doc(db, "employee-info", employee.uid), {
      ...employeeData,
      employeeAvailability: JSON.stringify(employeeData.employeeAvailability)  // Convert availability to JSON string
    });

    return employee;
  } catch (error) {
    console.error("Error during employee sign-up:", error);
    throw error;
  }
};
