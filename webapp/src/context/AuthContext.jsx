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
  const [sessionStatus, setSessionStatus] = useState("Initializing session...");
  const [memberships, setMemberships] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState("checking"); // 'checking', 'needsSubscription', 'complete'
  const doLogout = async () => {
    console.log("🔒 [AUTH] Logout requested.");
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
    console.log(`🏢 [SESSION] Setting active company: ${companyId}`);

    if (companySnap.exists() && memberSnap.exists()) {
      setActiveCompany({ id: companySnap.id, ...companySnap.data() });
      setActiveRole(memberSnap.data().role);
    }
    return null;
  }, []);

  // Function to load user session data
  const loadUserSession = useCallback(
    async (currentUser) => {
      console.log("🔄 [SESSION] Loading user session...");
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);
        setSessionStatus("Loading user data...");

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
        console.log(
          `📂 [SESSION] Found ${userMemberships.length} memberships for user ${currentUser.uid}.`
        );
        setMemberships(userMemberships);

        if (userMemberships.length === 1) {
          await setActiveCompanyById(userMemberships[0].companyId, currentUser);
        }

        setSessionStatus("Authenticated");
        setLoading(false); // Turn off loading only after all data is fetched
      } else {
        console.log("👤 [SESSION] No current user. Clearing session data.");
        setUser(null);
        setMemberships([]);
        setActiveCompany(null);
        setActiveRole(null);

        setSessionStatus("Unauthenticated");
        setLoading(false); // Turn off loading
      }
    },
    [setActiveCompanyById]
  );

  useEffect(() => {
    setLoading(true);
    setSessionStatus("Initializing session...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        `🔔 [AUTH] Auth state changed. User:`,
        currentUser?.uid || "None"
      );
      loadUserSession(currentUser);
    });
    return unsubscribe;
  }, [loadUserSession]);

  useEffect(() => {
    // Don't run the check until the initial user session loading is complete.
    if (loading) {
      console.log("⏳ [STATUS] Auth loading, skipping status check.");
      return;
    }
    if (activeCompany) {
      const subscriptionStatus = activeCompany.subscription?.status;
      const isSubscribed =
        subscriptionStatus === "active" || subscriptionStatus === "trialing";
      // If the company is not subscribed
      if (!isSubscribed) {
        console.log(
          `🚦 [STATUS] Company ${activeCompany.id} is NOT subscribed. Checking role...`
        );
        // ...determine the user's role
        if (activeRole === "owner") {
          // Only owners should be prompted to subscribe.
          sessionStorage.setItem("onboardingCompanyId", activeCompany.id);
          setOnboardingStatus("needsSubscription");
          console.log(
            "👑 [STATUS] User is owner. Setting status to 'needsSubscription'."
          );
        } else {
          // Non-owners get a different status.
          setOnboardingStatus("subscriptionRequired_contactAdmin");
          console.log(
            `👥 [STATUS] User role is '${activeRole}'. Setting status to 'subscriptionRequired_contactAdmin'.`
          );
        }
      } else {
        setOnboardingStatus("complete"); // Company has a valid subscription.
        console.log(
          `✅ [STATUS] Company ${activeCompany.id} has an active subscription. Status: 'complete'.`
        );
      }
    }
  }, [activeCompany, loading]);

  const value = {
    user,
    loading,
    sessionStatus,
    memberships,
    activeCompany,
    activeRole,
    setActiveCompanyById,
    onboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
