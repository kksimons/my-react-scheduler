// src/userAuth/services/SignInEmployee.js

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const SignInEmployee = async (employeeEmail, employeePassword) => {
  try {
    const employeeCredential = await signInWithEmailAndPassword(auth, employeeEmail, employeePassword);
    const employee = employeeCredential.user;

    // Fetch employee data from Firestore
    const employeeDocRef = doc(db, "employee-info", employee.uid);
    const employeeDoc = await getDoc(employeeDocRef);

    if (!employeeDoc.exists()) {
      throw new Error("Employee data not found in Firestore.");
    }

    // Extract only the required fields for sign-in
    const employeeData = employeeDoc.data();

    return { employee, employeeData };
  } catch (error) {
    console.error("Error during employee sign-in:", error);
    throw error;
  }
};
