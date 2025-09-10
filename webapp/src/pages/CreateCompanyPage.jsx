// src/pages/CreateCompanyPage.jsx
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../components/LanguageSwitcher';

// A local, self-contained FormField component for this page
const FormField = ({ id, label, type, placeholder, value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" htmlFor={id}>{label}</label>
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
      id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


const CreateCompanyPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setError('');
    if (!companyName.trim()) {
      setError('Please enter a company name.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "companies", user.uid), {
          ownerUid: user.uid,
          ownerEmail: user.email,
          companyName: companyName.trim(),
          createdAt: serverTimestamp(),
        });
        // After successfully creating the profile, navigate to the dashboard.
        // The onAuthStateChanged listener in App.jsx will handle fetching the new profile.
        navigate('/');
      } catch (err) {
        setError(err.message);
        console.error("Error creating company profile:", err);
      }
    } else {
      setError("You must be logged in to create a company.");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('oneLastStep')}</h1>
          <p className="text-center text-gray-600 mb-6">
            {t('finishSetup')}
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <FormField 
              id="companyName" label={t('companyNameLabel')} type="text"
              placeholder="e.g., GreenScapes Landscaping"
              value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              error={error}
            />
            <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-2" type="submit">
              {t('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyPage;