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

const initialSession = {
  status: 'LOADING',
  user: null,
  memberships: [],
  activeCompany: null,
  activeRole: null,
};

function App() {
  const [session, setSession] = useState(initialSession);
  const navigate = useNavigate();

  const setActiveCompanyById = useCallback(async (companyId, currentUser) => {
    const userToQuery = currentUser || auth.currentUser;
    if (!userToQuery) return null;

    const companySnap = await getDoc(doc(db, "companies", companyId));
    const memberSnap = await getDoc(doc(db, "companies", companyId, "members", userToQuery.uid));

    if (companySnap.exists() && memberSnap.exists()) {
      const companyData = { id: companySnap.id, ...companySnap.data() };
      const roleData = memberSnap.data().role;
      return { activeCompany: companyData, activeRole: roleData };
    }
    return null;
  }, []);

  const loadUserSession = useCallback(async (currentUser) => {
    if (!currentUser) {
      setSession({ ...initialSession, status: 'LOGGED_OUT' });
      return;
    }

    const membershipsRef = collection(db, "users", currentUser.uid, "memberships");
    const membershipSnapshot = await getDocs(membershipsRef);
    const userMemberships = membershipSnapshot.docs.map(doc => doc.data());

    if (userMemberships.length === 0) {
      setSession({ ...initialSession, status: 'NO_MEMBERSHIPS', user: currentUser });
      return;
    }

    if (userMemberships.length > 1) {
      setSession({ ...initialSession, status: 'SELECT_COMPANY', user: currentUser, memberships: userMemberships });
      return;
    }

    const companyData = await setActiveCompanyById(userMemberships[0].companyId, currentUser);
    if (companyData) {
      setSession({ status: 'LOGGED_IN', user: currentUser, memberships: userMemberships, ...companyData });
      navigate('/');
    } else {
      await handleLogout();
    }
  }, [setActiveCompanyById]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setSession(s => ({ ...s, status: 'LOADING' }));
      loadUserSession(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, [loadUserSession]);
  
  const doLogout = async () => {
    await handleLogout();
    navigate('/login');
  };
  
  useIdleTimer(doLogout);

  // The main loading spinner for the entire application.
  if (session.status === 'LOADING') {
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  // A new component that acts as our protected layout route.
  // It checks the user's session status and renders the correct UI.
  const ProtectedRoutes = () => {
    if (!session.user) {
      // If the user is not logged in at all, send them to the login page.
      return <Navigate to="/login" />;
    }
    
    if (session.memberships.length === 0) {
      // If the user is new and has no companies, send them to create one.
      return <Navigate to="/create-company" />;
    }
    
    if (session.memberships.length > 1 && !session.activeCompany) {
      // If the user has multiple companies but hasn't chosen one, show the selection page.
      return <CompanySelectionPage memberships={session.memberships} onSelectCompany={setActiveCompanyById} />;
    }
    
    if (session.activeCompany) {
      // We render the AppLayout, which contains an <Outlet /> for the child routes.
      return <AppLayout user={session.user} companyProfile={session.activeCompany} onLogout={doLogout} />;
    }

    // A fallback loading state while the active company is being set.
    return <div className="min-h-screen bg-slate-100"></div>;
  };

  return (
    <Routes>
      {/* Public Routes for logged-out users */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-company" element={
          session.user && session.memberships.length === 0 
          ? <CreateCompanyPage onProfileCreated={() => loadUserSession(auth.currentUser)} /> 
          : <Navigate to="/" />
      }/>

      {/* --- Protected Routes --- */}
      {/* All protected routes are now children of the ProtectedRoutes component. */}
      {/* The <Outlet/> in AppLayout will render these children. */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage companyProfile={session.activeCompany} />} />
        <Route 
          path="/settings" 
          element={
            <SettingsPage 
              user={session.user} 
              companyProfile={session.activeCompany} 
              memberProfile={{ role: session.activeRole }} 
              onProfileUpdate={() => loadUserSession(auth.currentUser)}
            />
          } 
        />
      </Route>
      
      {/* A final catch-all to redirect any unknown paths for logged-in users */}
      <Route path="*" element={<Navigate to={session.user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;