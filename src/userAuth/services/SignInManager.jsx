// src/userAuth/services/SignInManager.js

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const SignInManager = async (managerEmail, managerPassword) => {
  try {
    const managerCredential = await signInWithEmailAndPassword(auth, managerEmail, managerPassword);
    const manager = managerCredential.user;

    // Fetch manager data from Firestore
    const managerDocRef = doc(db, "manager-info", manager.uid);
    const managerDoc = await getDoc(managerDocRef);

    if (!managerDoc.exists()) {
      throw new Error("Manager data not found in system service. Please sign in again or create an account.");
    }

    // Extract the required fields for sign-in
    const managerData = managerDoc.data();

    return { manager, managerData };
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};
