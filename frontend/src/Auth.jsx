import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from './firebase.js'; // Import the auth instance with explicit file extension
import { doc, setDoc, serverTimestamp} from "firebase/firestore";

// This component provides a simple UI for signing up and logging in.
export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!companyName){
      setError("Company name is required to sign up.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Now, create the company profile document in Firestore
      // The document ID will be the user's unique ID (uid)
      await setDoc(doc(db,"companies",user.uid), {
        ownerUid: user.uid,
        owenerEmail: user.email,
        companyName: companyName,
        createdAt: serverTimestamp(),
      });
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">LawnLedgers</h1>
        <div className="space-y-4">
          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="companyName">
                  Company Name
                </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="companyName"
                type="text"
                placeholder="e.g., GreenScapes Landscaping"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </form>
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

