import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleGoogleSignIn, handleEmailLogin } from '../firebase/authService';
import { useTranslation } from 'react-i18next';

import FormField from '../components/FormField';
import GoogleIcon from '../components/icons/GoogleIcon';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
  if (email === '') {
    setIsEmailValid(true); // Don't show an error for an empty field
    return;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setIsEmailValid(regex.test(email));
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) {
      setError("Please enter a valid email address.")
      return;
    }

    try {
            // A single, clean call to our abstracted service function
      await handleEmailLogin(email, password);
      // The onAuthStateChanged listener in App.jsx will handle the redirect
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Caught login error in component:", err);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('welcomeBack')}</h1>
          <div className="my-4">
            <p className="text-center text-sm text-gray-500 mb-2">{t('signInWith')}</p>
            <div className="flex justify-center space-x-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="cursor-pointer w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                aria-label={t('signInWithGoogle')}
              >
                <GoogleIcon />
              </button>
              {/* Future social login buttons can be added here */}
            </div>
          </div>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">{t('orContinueWithEmail')}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <form onSubmit={handleLogin} noValidate>
            <FormField
              id="email"
              label={t('emailLabel')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isEmailValid ? 'Please enter a valid email format.' : ''}
            />
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">{t('passwordLabel')}</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
            {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}
            <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" type="submit">
              {t('logIn')}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/register" className="text-blue-600 hover:underline">
              {t('needAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;