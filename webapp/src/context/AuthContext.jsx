import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { handleLogout } from "../firebase/authService";
import useIdleTimer from "../hooks/useIdleTimer";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const doLogout = async () => {
    await handleLogout();
  };

  useIdleTimer(doLogout);

  // Function to set the active company and role based on companyId
  const setActiveCompanyById = useCallback(async (companyId, currentUser) => {
    const userToQuery = currentUser || auth.currentUser;
    if (!userToQuery) return;

    const companySnap = await getDoc(doc(db, "companies", companyId));
    const memberSnap = await getDoc(
      doc(db, "companies", companyId, "members", userToQuery.uid)
    );

    if (companySnap.exists() && memberSnap.exists()) {
      setActiveCompany({ id: companySnap.id, ...companySnap.data() });
      setActiveRole(memberSnap.data().role);
    }
    return null;
  }, []);

  // Function to load user session data
  const loadUserSession = useCallback(
    async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const membershipsRef = collection(
          db,
          "users",
          currentUser.uid,
          "memberships"
        );
        const membershipSnapshot = await getDocs(membershipsRef);
        const userMemberships = membershipSnapshot.docs.map((doc) =>
          doc.data()
        );
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
    },
    [setActiveCompanyById]
  );

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      await loadUserSession(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [loadUserSession]);

  const value = {
    user,
    loading,
    memberships,
    activeCompany,
    activeRole,
    setActiveCompanyById, // Expose your functions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
