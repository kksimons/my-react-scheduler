import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCey0QGSAn2QsMyKrHJQ5nojR92KOXMiE8",
  authDomain: "powershift-29522.firebaseapp.com",
  projectId: "powershift-29522",
  storageBucket: "powershift-29522.appspot.com",
  messagingSenderId: "880153414164",
  appId: "1:880153414164:web:402906cbf5ba9fde673501",
  measurementId: "G-KV9E3CL7BF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
auth.languageCode = 'it';



export { db, auth, storage, provider };