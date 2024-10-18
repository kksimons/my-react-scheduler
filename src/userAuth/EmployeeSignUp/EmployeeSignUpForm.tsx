// src/userAuth/services/SignUpEmployee.ts

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { EmployeeData } from "../../components/EmployeeData";

// SignUpEmployee starts here 
export const SignUpEmployee = async (
  employee: EmployeeData,
  password: string
) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, employee.employeeEmail, password);
    const user = userCredential.user; 

    // Prepare employee data
    const employeeData = { 
      firstName: employee.employeeFname,
      lastName: employee.employeeLname,
      dob: employee.employeeDob,
      phone: employee.employeePhone,
      email: employee.employeeEmail,
      type: employee.employeeType,
      position: employee.employeePosition,
      system: employee.employeeSystem,
      availability: employee.employeeAvailability,
      profilePic: "https://picsum.photos/24", // Default profile picture
    };

    // Save employee data to Firestore in 'employees' collection
    await setDoc(doc(db, "employees", user.uid), employeeData);

    return user;
  } catch (error) {
    console.error("Error during employee sign-up:", error);
    throw error;
  }
};
