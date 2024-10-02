// src/userAuth/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize GitHub provider
const githubProvider = new GithubAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

export { db, auth, githubProvider };