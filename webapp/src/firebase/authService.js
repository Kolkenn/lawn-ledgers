import { auth, db } from './config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAdditionalUserInfo
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch 
} from "firebase/firestore";

/**
 * Processes an invitation for a newly registered user.
 * If the user has a valid pending invitation, they are added to the specified company as a member.
 * 
 * @param {object} user - The Firebase user object of the newly registered user.
 * @param {string} inviteCode - The invitation code to process.
 */
const processInvite = async (user, inviteCode) => {
    if (!inviteCode) return; // Do nothing if there's no code

    const inviteDocRef = doc(db, 'invitations', inviteCode);
    const inviteSnap = await getDoc(inviteDocRef);

    // Verify the invite exists, is pending, and is for the correct user
    if (inviteSnap.exists() && inviteSnap.data().status === 'pending' && inviteSnap.data().email === user.email) {
        const inviteData = inviteSnap.data();
        const companyId = inviteData.companyId;

        const batch = writeBatch(db);
        const newMemberRef = doc(db, "companies", companyId, "members", user.uid);
        batch.set(newMemberRef, {
            email: user.email,
            role: inviteData.role,
            joinedAt: serverTimestamp(),
        });
        batch.update(inviteDocRef, { status: 'accepted', acceptedBy: user.uid });
        await batch.commit();
        console.log("Invite processed successfully!");
    } else {
        console.warn("Invalid or already accepted invite code.");
    }
};

export const handleGoogleSignIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const handleEmailSignUp = async (email, password) => {
  try {
    // This function is now only responsible for creating the user in Firebase Auth.
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await processInvite(userCredential.user, inviteCode);
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