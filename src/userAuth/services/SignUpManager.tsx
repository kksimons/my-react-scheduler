// src/userAuth/services/SignUpManager.tsx
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

interface ManagerData {
  managerFname: string;
  managerLname: string;
  managerPosition: string; 
  managerEmail: string;
}

//signUpManager starts here 
export const SignUpManager = async (
  managerFname: string, //first name
  managerLname: string, //last name 
  managerPosition: string, //position
  managerEmail: string,  //email
  managerPassword: string //password 
) => {
  try {
    // Create user with Firebase Auth "createUserWithEmailAndPassword"
    //The reason why there is only auth,email,password is because this is what manager uses to SIGN IN
    const managerCredential = await createUserWithEmailAndPassword( auth, managerEmail, managerPassword);
    const manager = managerCredential.user; //const manager contains the manager sign in information 

    // Prepare manager database 
    const managerData: ManagerData = { managerFname, managerLname, managerPosition, managerEmail, };

    // Save manager data to Firestore in 'manager-info' collection
    await setDoc(doc(db, "manager-info", manager.uid), managerData);

    return manager;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};
