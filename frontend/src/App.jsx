import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { handleLogout } from './firebase/authService'; 
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

// Import the new page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import LogoutIcon from './components/icons/LogoutIcon';
import useIdleTimer from './hooks/useIdleTimer';

// A new component for our main dashboard page
const Dashboard = ({ user, companyProfile, onLogout }) => {
  const { t } = useTranslation();
  
  return (
  <div className="p-8">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        {t('welcomeTo', { companyName: companyProfile?.companyName || t('yourDashboard') })}
      </h1>
      <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button 
            onClick={onLogout} 
            className="cursor-pointer w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"            aria-label={t('logOut')}
          >
            <LogoutIcon />
          </button>
        </div>
    </div>
    <p className="mt-2 text-gray-600">You are logged in as {user.email}</p>
  </div>
  )
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);

  useIdleTimer(handleLogout);

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
              <Dashboard user={user} companyProfile={companyProfile} onLogout={handleLogout} />
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