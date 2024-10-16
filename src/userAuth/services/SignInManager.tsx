// src/userAuth/services/SignInManager.ts

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ManagerData {
  managerFname: string;
  managerLname: string;
  managerDOB: string;
  managerPosition: string;
  managerEmail: string;
}

interface SignInResult {
  manager: User;
  managerData: ManagerData;
}

// signInManager starts here
export const SignInManager = async (
  managerEmail: string, // email
  managerPassword: string // password
): Promise<SignInResult> => {
  try {
    // Authenticate manager with Firebase Auth
    const managerCredential = await signInWithEmailAndPassword(auth, managerEmail, managerPassword);
    const manager = managerCredential.user;

    // Fetch manager data from Firestore
    const managerDocRef = doc(db, "manager-info", manager.uid);
    const managerDoc = await getDoc(managerDocRef);

    if (!managerDoc.exists()) {
      throw new Error("Manager data not found in Firestore.");
    }

    const managerData = managerDoc.data() as ManagerData;

    return { manager, managerData };
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    // Optionally, handle specific Firebase Auth errors here
    throw error;
  }
};
