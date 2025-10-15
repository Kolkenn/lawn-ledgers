import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { getMemberships, getCompany, getRoleInCompany } from "../api/companies";

import { handleLogout } from "../firebase/authService";
import useIdleTimer from "../hooks/useIdleTimer";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState("Initializing session...");
  const [activeCompanyId, setActiveCompanyId] = useState(null);

  // The onboarding status check remains here as it's closely tied to the session logic.
  const [onboardingStatus, setOnboardingStatus] = useState("checking"); // 'checking', 'needsSubscription', 'complete'
  const doLogout = async () => {
    console.log("🔒 [AUTH] Logout requested.");
    await handleLogout();
  };

  useIdleTimer(doLogout);

  // --- DATA FETCHING WITH TANSTACK QUERY ---
  // Fetch the user's memberships. This query is dependent on the user's UID.
  const { data: memberships, isLoading: isLoadingMemberships } = useQuery({
    queryKey: ["memberships", user?.uid],
    queryFn: () => getMemberships(user.uid),
    enabled: !!user, // Only run this query when the user is logged in
  });

  // Fetch the full active company profile. This query depends on `activeCompanyId`.
  const { data: activeCompany, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", activeCompanyId],
    queryFn: () => getCompany(activeCompanyId),
    enabled: !!activeCompanyId,
    staleTime: 5 * 60 * 1000, // Cache company data for 5 minutes
  });

  // Fetch the user's role in the active company.
  const { data: activeRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ["role", user?.uid, activeCompanyId],
    queryFn: () => getRoleInCompany(user.uid, activeCompanyId),
    enabled: !!user && !!activeCompanyId,
    staleTime: 5 * 60 * 1000, // Cache role data for 5 minutes
  });
  // -----------------------------------------

  useEffect(() => {
    setLoading(true);
    setSessionStatus("Initializing session...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        `🔔 [AUTH] Auth state changed. User:`,
        currentUser?.uid || "None"
      );
      if (currentUser) {
        setUser(currentUser);
        // The membership query will automatically run now that `user` is set.
      } else {
        // Clear all session state on logout
        setUser(null);
        setActiveCompanyId(null);
        setSessionStatus("Unauthenticated");
      }
      // The initial auth check is complete, so we can set loading to false.
      // The rest of the app will react to the user object being set.
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // This effect determines the active company once memberships are loaded.
  useEffect(() => {
    if (memberships && memberships.length > 0 && !activeCompanyId) {
      // Default to the first company if multiple exist.
      // You could enhance this to use localStorage to remember the last active company.
      setActiveCompanyId(memberships[0].companyId);
    }
  }, [memberships, activeCompanyId]);

  // This effect updates the session status once all core data is loaded.
  useEffect(() => {
    if (user && !isLoadingMemberships && !isLoadingCompany && !isLoadingRole) {
      setSessionStatus("Authenticated");
    }
  }, [user, isLoadingMemberships, isLoadingCompany, isLoadingRole]);

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
    // The main loading flag now only signals the initial auth check.
    loading,
    sessionStatus,
    memberships,
    activeCompany,
    activeRole,
    // Expose a function to allow switching companies
    setActiveCompanyId,
    onboardingStatus,
    isLoadingCompany,
    isLoadingMemberships, // Expose this for staged loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
