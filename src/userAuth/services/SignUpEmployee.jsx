import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// export const SignUpEmployee = async (employeeEmail, employeePassword) => {
//   try {
//     const employeeCredential = await createUserWithEmailAndPassword(auth, employeeEmail, employeePassword);
//     const employee = employeeCredential.user;

//     const employeeData = {
//       employeeFirstName: employeeData.employeeFirstName,
//       employeeLastName: employeeData.employeeLastName,
//       employeeDob: employeeData.employeeDob,
//       employeeGender: employeeData.employeeGender,
//       employeePhoneNumber: employeeData.employeePhoneNumber,
//      // employeeEmail: employeeData.employeeEmail,
//      // employeePassword: employeeData.employeePassword,
//       employeeType: employeeData.employeeType,
//       employeePositions: employeeData.employeePositions,
//       employeeAvailability: JSON.stringify(employeeData.employeeAvailability)  // Convert availability to JSON string
//     };

//     // Save employee data to Firestore
//     await setDoc(doc(db, "employee-info", employee.uid), employeeData);

//     return employee;
//   } catch (error) {
//     console.error("Error during employee sign-up:", error);
//     throw error;
//   }
// };

// export default SignUpEmployee;

// In SignUpEmployee.jsx
export const SignUpEmployee = async (employeeData) => {

  const auth = getAuth();
  try {
    const employeeCredential = await createUserWithEmailAndPassword(auth, email, password);
    const employee = employeeCredential.user;

    // Firestore employee data, removing sensitive information like password
    const sanitizedEmployeeData = {
      employeeFirstName: employeeData.employeeFirstName,
      employeeLastName: employeeData.employeeLastName,
      employeeDob: employeeData.employeeDob,
      employeeGender: employeeData.employeeGender,
      employeePhoneNumber: employeeData.employeePhoneNumber,
      employeeType: employeeData.employeeType,
      employeePositions: employeeData.employeePositions,
      employeeAvailability: employeeData.employeeAvailability
    };

    // Save employee data to Firestore
    await setDoc(doc(db, "employee-info", employee.uid), sanitizedEmployeeData);

    return employee;
  } catch (error) {
    console.error("Error during employee sign-up:", error);
    throw error;
  }
};
export default SignUpEmployee;
