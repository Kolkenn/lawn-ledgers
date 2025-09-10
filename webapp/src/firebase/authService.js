import { auth, db } from './config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

/**
 * Signs a new user up with email and password, and creates their company profile.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} companyName - The user's company name.
 */
export const handleEmailSignUp = async (email, password, companyName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create the associated company profile document in Firestore
    await setDoc(doc(db, "companies", user.uid), {
      ownerUid: user.uid,
      ownerEmail: user.email,
      companyName: companyName.trim(),
      createdAt: serverTimestamp(),
    });
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