import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from './firebase.js'; // Import the auth instance with explicit file extension

// This component provides a simple UI for signing up and logging in.
export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError(''); // Clear previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.jsx will handle the redirect
    } catch (err) {
      setError(err.message);
      console.error("Error signing up:", err);
    }
  };

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.jsx will handle the redirect
    } catch (err) {
      setError(err.message);
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">LawnLedgers</h2>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button 
            onClick={handleLogin} 
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={handleSignUp} 
            className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

