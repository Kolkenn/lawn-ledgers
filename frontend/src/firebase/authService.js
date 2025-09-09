import { auth } from './config';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

/**
 * Initiates the Google Sign-In popup flow.
 * This function can be used for both login and registration.
 * Firebase automatically handles creating a new user or signing in an existing one.
 * The onAuthStateChanged listener in App.jsx will handle the result.
 */
export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    // No need to return anything, the listener in App.jsx takes over
  } catch (err) {
    // Log the error for debugging purposes.
    // We could pass an error handler function here in the future if needed.
    console.error("Error during Google sign-in:", err);
    // We can re-throw the error if we want the component to handle it
    throw err;
  }
};

// We can add other auth functions here in the future,
// like handleEmailLogin, handleSignUp, handleLogout, etc.