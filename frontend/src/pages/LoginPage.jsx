// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import FormField from '../components/FormField';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.168,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      // This will open a popup for the user to sign in
      await signInWithPopup(auth, provider);
      // After this, the onAuthStateChanged listener in App.jsx will take over
    } catch (err) {
      setError(err.message);
      console.error("Error during Google sign-in:", err);
    }
  };

  useEffect(() => {
  if (email === '') {
    setIsEmailValid(true); // Don't show an error for an empty field
    return;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setIsEmailValid(regex.test(email));
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) {
      setError("Please enter a valid email address.")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Lawn Ledgers</h1>
        
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <form onSubmit={handleLogin} noValidate>
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!isEmailValid ? 'Please enter a valid email format.' : ''}
          />
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password" type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}
          <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors" type="submit">
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-600 hover:underline">
            Need an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;