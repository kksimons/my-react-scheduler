// src/userAuth/services/SignUpManager.tsx

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ManagerData } from "../../components/ManagerData";  // Import the full ManagerData interface

export const SignUpManager = async (
  managerFname: string,
  managerLname: string,
  managerDob: string,
  managerPosition: string,
  managerEmail: string,
  managerPassword: string
) => {
  try {
    const managerCredential = await createUserWithEmailAndPassword(auth, managerEmail, managerPassword);
    const manager = managerCredential.user;

    const managerData: ManagerData = { 
      managerFname, 
      managerLname, 
      managerDob, 
      managerPosition, 
      managerEmail 
    };

    // Save the manager's data to Firestore in the 'manager-info' collection
    await setDoc(doc(db, "manager-info", manager.uid), managerData);

    return manager;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};
