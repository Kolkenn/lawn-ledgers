// External Imports
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

// Internal Imports ( Custom Tools )
import { Auth } from './Auth';

function App() {
  // State Variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser){
        setUser(currentUser);
        await fetchCompanyProfile(currentUser.uid);
      } else {
        setUser(null);
        setCompanyProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 

  const fetchCompanyProfile = async (uid) => {
    setLoadingProfile(true);
    try {
      const docRef = doc(db, "companies", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompanyProfile(docSnap.data());
      } else {
        console.log("No such company document!");
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  // This is the main render logic.
  // If a user object exists, it means they are logged in.
  // If not, we show the Auth component.
  return (
    <div>
      {user ? (
        <div className="p-8">
          <div className="flex justify-between items-center">
            {loadingProfile ? (
              <h1 className="text-3xl font-bold">Loading...</h1>
            ) : (
              <h1 className="text-3xl font-bold">
                Welcome to {companyProfile?.companyName || 'Your Dashboard'}
              </h1>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
          <p className="mt-4">You are now logged in as {user.email}</p>
          <p className="text-sm text-gray-500 mt-2">Your User ID is: {user.uid}</p>
        </div>
      ) : (
        // What a logged-out user will see
        <Auth />
      )}
    </div>
  );
}

export default App;

