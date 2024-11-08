import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Initialize the Firebase auth and provider
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Google Sign-In function //promise based
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Access the Google API token if needed
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // Signed-in user info
    const user = result.user;
    return { user, token }; // Return user and token if needed
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return {
      errorCode: error.code,
      errorMessage: error.message,
      email: error.customData?.email,
      credential: GoogleAuthProvider.credentialFromError(error),
    };
  }
};

export default auth;
