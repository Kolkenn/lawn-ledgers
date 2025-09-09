import { useState, useEffect, use } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import FormField from '../components/FormField';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.168,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [validation, setValidation] = useState({
    email: { isValid: true, message: '' },
    companyName: { isValid: true, message: '' },
    password: {
      length: false, 
      uppercase: false, 
      lowercase: false, 
      number: false, 
      special: false,
    },
    confirmPassword: { isValid: true, message: '' },
  });

  // --- Real-time Validation using useEffect Hooks ---
  // 1. Validate Email as the user types
  useEffect(() => {
    if (email === '') { // Don't show error on empty field
      setValidation(v => ({ ...v, email: { isValid: true, message: '' } }));
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setValidation(v => ({ ...v, email: { 
      isValid, 
      message: isValid ? '' : 'Please enter a valid email format.' 
    }}));
  }, [email]);

  // 2. Validate Company Name as the user types
  useEffect(() => {
    if (companyName === '') {
      setValidation(v => ({ ...v, companyName: { isValid: true, message: '' } }));
      return;
    }
    const isValid = companyName.length > 0;
    setValidation(v => ({ ...v, companyName: { 
      isValid, 
      message: isValid ? '' : 'Company name is required.' 
    }}));
  }, [companyName]);

  // 3. Validate Password strength as the user types
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  // 4. Validate Confirm Password field whenever password or confirmPassword changes
  useEffect(() => {
    if (confirmPassword === '' && password === '') {
      setValidation(v => ({ ...v, confirmPassword: { isValid: true, message: '' }}));
      return;
    }
    const isValid = password === confirmPassword;
    setValidation(v => ({ ...v, confirmPassword: { 
      isValid, 
      message: isValid ? '' : 'Passwords do not match.' 
    }}));
  }, [password, confirmPassword]);

  const setPasswordValidation = (criteria) => {
    setValidation(v => ({ ...v, password: criteria }));
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // This single function handles both registration and login
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener in App.jsx will handle the rest,
      // including checking for a company profile and redirecting.
    } catch (err) {
      // We can display this error if needed, but for now, we'll log it.
      console.error("Error during Google sign-in:", err);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // --- Start Validation ---

    // The .trim() function removes any whitespace from the beginning or end.
    if (companyName.trim() === '') {
        setValidation(v => ({ ...v, companyName: { isValid: false, message: 'Company name is required.' } }));
        return;
    }
    const isPasswordStrong = Object.values(validation.password).every(Boolean);
    if (!validation.email.isValid || !isPasswordStrong || !validation.confirmPassword.isValid) {
      // This provides a general error if the user tries to submit an invalid form
      alert("Please correct the errors before signing up.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "companies", user.uid), {
        ownerUid: user.uid,
        ownerEmail: user.email,
        companyName: companyName.trim(),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      alert(err.message);
      console.error("Error during sign up:", err);
    }
  };

  // Helper to dynamically set the password field's outline color
  const isPasswordMismatch = !validation.confirmPassword.isValid && confirmPassword !== '';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h1>
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          <span>Sign up with Google</span>
        </button>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSignUp} noValidate>
          <FormField 
            id="companyName" label="Company Name" type="text" placeholder="e.g., GreenScapes Landscaping"
            value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            error={!validation.companyName.isValid ? validation.companyName.message : ''}
          />
          <FormField 
            id="email" label="Email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            error={!validation.email.isValid ? validation.email.message : ''}
          />
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password" type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
            <PasswordStrengthIndicator validation={validation.password} />
          </div>
          <FormField 
            id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            error={!validation.confirmPassword.isValid ? validation.confirmPassword.message : ''}
          />

          <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors" type="submit">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;