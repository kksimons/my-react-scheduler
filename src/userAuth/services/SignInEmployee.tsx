// src/userAuth/services/SignInEmployee.ts

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface EmployeeData {
  employeeFname: string;
  employeeLname: string;
  employeePosition: string;
  employeeEmail: string;
}

interface SignInResult {
  employee: User;
  employeeData: EmployeeData;
}

// Function to sign in an employee and fetch employee data from Firestore
export const signInEmployee = async (
  employeeEmail: string,  // Email
  employeePassword: string // Password
): Promise<SignInResult> => {
  try {
    // Sign in the employee using Firebase Auth
    const employeeCredential = await signInWithEmailAndPassword(auth, employeeEmail, employeePassword);
    const employee = employeeCredential.user;

    // Fetch employee data from Firestore
    const employeeDocRef = doc(db, "employee-info", employee.uid);
    const employeeDoc = await getDoc(employeeDocRef);

    if (!employeeDoc.exists()) {
      throw new Error("Employee data not found in Firestore.");
    }

    // Extract employee data
    const employeeData = employeeDoc.data() as EmployeeData;

    return { employee, employeeData };
  } catch (error: any) {
    console.error("Error during employee sign-in:", error);
    throw error;
  }
};
