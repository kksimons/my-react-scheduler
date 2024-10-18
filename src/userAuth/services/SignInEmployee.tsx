// src/userAuth/services/SignInEmployee.ts

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { SignInEmployeeData } from "../../components/EmployeeData";  // Import partial data

interface SignInResult {
  employee: User;
  employeeData: SignInEmployeeData;
}

export const signInEmployee = async (
  employeeEmail: string,
  employeePassword: string
): Promise<SignInResult> => {
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
    const employeeData = employeeDoc.data() as SignInEmployeeData;

    return { employee, employeeData };
  } catch (error) {
    console.error("Error during employee sign-in:", error);
    throw error;
  }
};
