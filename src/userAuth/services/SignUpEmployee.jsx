// import { auth, db } from "../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";

// export const SignUpEmployee = async (employeeData, employeePassword) => {
//   try {
//     // Sign up the employee and get the user credential
//     const employeeCredential = await createUserWithEmailAndPassword(auth, employeeData.employeeEmail, employeePassword);
//     const employee = employeeCredential.user;

//     // Prepare sanitized employee data for Firestore (excluding sensitive information like password)
//     const sanitizedEmployeeData = {
//       employee_fname: employeeData.employeeFirstName,
//       employee_lname: employeeData.employeeLastName,
//       employee_dob: employeeData.employeeDob,
//       employee_phone_number: employeeData.employeePhoneNumber.toString(), // Ensure phone number is a string
//       employee_type: employeeData.employeeType,
//       employee_position: employeeData.employeePositions.join(", "), // Convert array to a string, if needed
//       employee_availability: JSON.stringify(employeeData.employeeAvailability), // Convert availability to JSON string
//       employee_system: "some_value" // Placeholder for employee_system; replace with actual value
//     };

//     // Save employee data to the Firestore "employees" collection using the employee's UID as the document ID
//     await setDoc(doc(db, "employees", employee.uid), sanitizedEmployeeData);

//     return employee;
//   } catch (error) {
//     console.error("Error during employee sign-up:", error);
//     throw error;
//   }
// };

// export default SignUpEmployee;

