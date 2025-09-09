import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

// Import the new page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCompanyPage from './pages/CreateCompanyPage';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db,"companies",currentUser.uid)
        const docSnap = await getDoc(docRef);

        setUser(currentUser);
        if (docSnap.exists()) {
          setCompanyProfile(docSnap.data())
        } else {
          setCompanyProfile(null);
        }
      }
      else {
        setUser(null);
        setCompanyProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route 
        path="/create-company" 
        element={user && !companyProfile ? <CreateCompanyPage /> : <Navigate to="/" />} />
      <Route 
        path="/" 
        element={
          user ? (
            companyProfile ? (
              <Dashboard user={user} companyProfile={companyProfile} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/create-company" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;