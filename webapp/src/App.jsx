// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, writeBatch, serverTimestamp } from "firebase/firestore";

// Import all necessary components and services
import useIdleTimer from './hooks/useIdleTimer';
import { handleLogout } from './firebase/authService';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import CompanySelectionPage from './pages/CompanySelectionPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  // Function to set the active company and role based on companyId
  const setActiveCompanyById = useCallback(async (companyId, currentUser) => {
    const userToQuery = currentUser || auth.currentUser;
    if (!userToQuery) return;

    const companySnap = await getDoc(doc(db, "companies", companyId));
    const memberSnap = await getDoc(doc(db, "companies", companyId, "members", userToQuery.uid));

    if (companySnap.exists() && memberSnap.exists()) {
      setActiveCompany({ id: companySnap.id, ...companySnap.data() });
      setActiveRole(memberSnap.data().role);
    }
    return null;
  }, []);

  // Function to load user session data
  const loadUserSession = useCallback(async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      const membershipsRef = collection(db, "users", currentUser.uid, "memberships");
      const membershipSnapshot = await getDocs(membershipsRef);
      const userMemberships = membershipSnapshot.docs.map(doc => doc.data());
      setMemberships(userMemberships);

      if (userMemberships.length === 1) {
        await setActiveCompanyById(userMemberships[0].companyId, currentUser);
      }
    } else {
      setUser(null);
      setMemberships([]);
      setActiveCompany(null);
      setActiveRole(null);
    }
  }, [setActiveCompanyById]);;
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      await loadUserSession(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadUserSession]);

  const handleProfileCreatedOrUpdated = useCallback(async () => {
    setLoading(true);
    await loadUserSession(auth.currentUser);
    setLoading(false);
  }, [loadUserSession]);
  
  const doLogout = async () => {
    await handleLogout();
    navigate('/');
  };
  
  useIdleTimer(doLogout);

  // The main loading spinner for the entire application.
  if (loading) {
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  const ProtectedRoutes = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (memberships.length === 0) {
      return <Navigate to="/create-company" />;
    }
    if (memberships.length > 1 && !activeCompany) {
      return <CompanySelectionPage memberships={memberships} onSelectCompany={setActiveCompanyById} />;
    }
    if (activeCompany) {
      // The user is fully authenticated. Render the main layout.
      // The <Outlet/> inside AppLayout will then render the correct child page.
      return <AppLayout user={user} companyProfile={activeCompany} />;
    }
    // A fallback for the brief moment a multi-company user is choosing.
    return <div className="min-h-screen bg-slate-100"></div>;
  };

  return (
    <Routes>
      {/* Public Routes for logged-out users */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route 
        path="/create-company" 
        element={user && memberships.length === 0 ? <CreateCompanyPage onProfileCreated={handleProfileCreatedOrUpdated} /> : <Navigate to="/" />}
      />

      {/* --- Protected Routes --- */}
      {/* All protected routes are now children of the ProtectedRoutes component. */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage companyProfile={activeCompany} />} />
        <Route 
          path="/settings" 
          element={
            <SettingsPage 
              user={user} 
              companyProfile={activeCompany} 
              memberProfile={{ role: activeRole }} 
              onProfileUpdate={handleProfileCreatedOrUpdated}
            />
          } 
        />
      </Route>
      
      {/* A final catch-all to redirect any unknown paths for logged-in users */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;