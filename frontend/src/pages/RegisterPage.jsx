import { useState, useEffect, use } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { handleGoogleSignIn } from '../firebase/authService';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import FormField from '../components/FormField';
import GoogleIcon from '../components/icons/GoogleIcon';

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
          <div className="my-4">
          <p className="text-center text-sm text-gray-500 mb-2">Sign up with</p>
          <div className="flex justify-center space-x-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="cursor-pointer w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
              aria-label="Sign up with Google"
            >
              <GoogleIcon />
            </button>
            {/* Future providers like Apple, Facebook, etc., can be added here */}
          </div>
        </div>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or continue with email</span>
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

          <button className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors" type="submit">
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