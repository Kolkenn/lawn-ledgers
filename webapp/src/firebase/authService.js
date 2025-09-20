import { auth } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

/**
 * Initiates the Google Sign-In popup flow. Returns the sign-in result.
 * The application's main logic will use the result to determine if the user is new.
 */
export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    return result; // Return the full result for the caller to inspect
  } catch (err) {
    console.error("Error during Google sign-in:", err);
    throw err;
  }
};

/**
 * Signs a new user up with email and password and sets their display name.
 * It no longer handles invite logic.
 */
export const handleEmailSignUp = async (email, password, fullName) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // After creating the user, update their Firebase Auth profile with their name.
    if (userCredential.user && fullName) {
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });
    }
    return userCredential;
  } catch (err) {
    console.error("Error during email sign up:", err);
    throw err;
  }
};

/**
 * Logs a user in with their email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export const handleEmailLogin = async (email, password) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Error during email login:", err);
    throw err;
  }
};

/**
 * Logs the current user out.
 */
export const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Error signing out:", err);
    throw err;
  }
};
