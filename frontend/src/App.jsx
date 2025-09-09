// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

// Import the new page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// A new component for our main dashboard page
const Dashboard = ({ user, companyProfile, handleLogout }) => (
  <div className="p-8">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        Welcome to {companyProfile?.companyName || 'Your Dashboard'}
      </h1>
      <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
        Log Out
      </button>
    </div>
    <p className="mt-2 text-gray-600">You are logged in as {user.email}</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchCompanyProfile(currentUser.uid);
        navigate('/'); // Redirect to dashboard after login/signup
      } else {
        setUser(null);
        setCompanyProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchCompanyProfile = async (uid) => {
    const docRef = doc(db, "companies", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCompanyProfile(docSnap.data());
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100"></div>; // Or a proper loading spinner
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route 
        path="/" 
        element={
          user ? (
            <Dashboard user={user} companyProfile={companyProfile} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
}

export default App;