// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { handleGoogleSignIn } from '../firebase/authService';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import FormField from '../components/FormField';
import GoogleIcon from '../components/icons/GoogleIcon';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

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
        <div className="my-4">
          <p className="text-center text-sm text-gray-500 mb-2">Sign in with</p>
          <div className="flex justify-center space-x-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="cursor-pointer w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"              aria-label="Sign in with Google"
            >
              <GoogleIcon />
            </button>
            {/* Future social login buttons can be added here */}
          </div>
        </div>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or continue with email</span>
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
          <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" type="submit">
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