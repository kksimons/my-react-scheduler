import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const SignUpManager = async (managerData, managerPassword) => {
  try {
    const managerCredential = await createUserWithEmailAndPassword(auth, managerData.managerEmail, managerPassword);
    const manager = managerCredential.user;

    const managerData = {
      managerFirstName: managerData.managerFirstName,
      managerLastName: managerData.managerLastName,
      managerDob: managerData.managerDob,
      managerPosition: managerData.managerPosition,
      managerEmail: managerData.managerEmail
    };

    // Save manager data to Firestore
    await setDoc(doc(db, "manager-info", manager.uid), managerData);

    return manager;
  } catch (error) {
    console.error("Error during manager sign-up:", error);
    throw error;
  }
};

export default SignUpManager;