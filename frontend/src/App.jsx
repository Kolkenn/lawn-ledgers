import { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import the auth instance from our config file
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Auth } from './Auth'; // Import our new Auth component

function App() {
  // This state will hold the current user object if they are logged in
  const [user, setUser] = useState(null);
  // This state will help us avoid a flicker effect while Firebase checks the auth state
  const [loading, setLoading] = useState(true);

  // This is the core of our authentication system.
  // useEffect with an empty dependency array runs once when the component mounts.
  useEffect(() => {
    // onAuthStateChanged is a listener from Firebase. It fires whenever the
    // user's login state changes (login, logout, or on initial page load).
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // If the user is logged in, currentUser will be their user object. If not, it will be null.
      setLoading(false); // We're done checking, so we can stop showing a loading state.
    });

    // This is a cleanup function. When the App component unmounts (e.g., user navigates away),
    // we unsubscribe from the listener to prevent memory leaks.
    return () => {
      unsubscribe();
    };
  }, []); // The empty array [] means this effect runs only once.

  // A simple function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // While Firebase is checking the auth state, we can show a loading message.
  // This prevents the user from briefly seeing the login page even if they are already logged in.
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
        // What a logged-in user will see
        <div className="p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
          <p className="mt-4">You are now logged in. The main application dashboard will be built here.</p>
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

