import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const SignUpEmployee = async (employeeData, employeePassword) => {
  try {
    const employeeCredential = await createUserWithEmailAndPassword(auth, employeeData.employeeEmail, employeePassword);
    const employee = employeeCredential.user;

    const employeeDataToSave = {
      employeeFirstName: employeeData.employeeFirstName,
      employeeLastName: employeeData.employeeLastName,
      employeeDob: employeeData.employeeDob,
      employeeGender: employeeData.employeeGender,
      employeePhoneNumber: employeeData.employeePhoneNumber,
      employeeType: employeeData.employeeType,
      employeePositions: employeeData.employeePositions,
      employeeAvailability: JSON.stringify(employeeData.employeeAvailability)  // Convert availability to JSON string
    };

    // Save employee data to Firestore
    await setDoc(doc(db, "employee-info", employee.uid), employeeDataToSave);

    return employee;
  } catch (error) {
    console.error("Error during employee sign-up:", error);
    throw error;
  }
};

export default SignUpEmployee;