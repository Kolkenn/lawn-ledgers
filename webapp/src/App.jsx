import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { handleLogout } from './firebase/authService';
import { doc, getDoc } from "firebase/firestore";

// Layout and Page Components
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import useIdleTimer from './hooks/useIdleTimer' 

function App() {
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useIdleTimer(handleLogout);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "companies", currentUser.uid);
        const docSnap = await getDoc(docRef);

        setUser(currentUser);
        if (docSnap.exists()) {
          setCompanyProfile(docSnap.data());
        } else {
          setCompanyProfile(null);
        }
      } else {
        setUser(null);
        setCompanyProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setCompanyProfile(updatedProfile);
  };

  const fetchCompanyProfile = async (uid) => {
  const docRef = doc(db, "companies", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
  };

  const handleProfileCreated = async () => {
    if (auth.currentUser) {
      const profile = await fetchCompanyProfile(auth.currentUser.uid);
      if (profile) {
        setCompanyProfile(profile);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  // A private route component to protect our layout
  const PrivateRoutes = () => {
      if (!user) return <Navigate to="/login" />;
      if (user && !companyProfile) return <Navigate to="/create-company" />;
      return <AppLayout user={user} companyProfile={companyProfile} />;
  };

  return (
    <div className="relative">
        {/* The global language switcher */}
        {!user && <div className="absolute top-4 right-4 z-10"><LanguageSwitcher /></div>}

        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/create-company" element={user && !companyProfile ? <CreateCompanyPage onProfileCreated={handleProfileCreated} /> : <Navigate to="/" />}  
            />

            {/* Protected Routes inside the AppLayout */}
            <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DashboardPage companyProfile={companyProfile} />} />
                <Route 
                    path="/settings" 
                    element={
                        <SettingsPage 
                            user={user} 
                            companyProfile={companyProfile} 
                            onProfileUpdate={handleProfileUpdate} 
                        />
                    } 
                />
            </Route>
        </Routes>
    </div>
  );
}

export default App;