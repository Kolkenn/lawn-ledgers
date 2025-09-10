import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
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

const CreateCompanyPage = ({ onProfileCreated }) => {
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!companyName.trim()) {
      setError('Please enter a company name.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        // Use a batch write to ensure both documents are created atomically
        const batch = writeBatch(db);

        // 1. Define the reference for the main company document
        const companyDocRef = doc(db, "companies", user.uid);
        batch.set(companyDocRef, {
          ownerUid: user.uid,
          companyName: companyName.trim(),
          createdAt: serverTimestamp(),
        });

        // 2. Define the reference for the owner's document in the members sub-collection
        const memberDocRef = doc(db, "companies", user.uid, "members", user.uid);
        batch.set(memberDocRef, {
          email: user.email,
          role: "owner", // <-- Assign the 'owner' role
          joinedAt: serverTimestamp(),
        });

        // 3. Commit the batch
        await batch.commit();

        // Before navigating, we call the function passed from App.jsx.
        // This tells the parent component to update its state immediately.
        await onProfileCreated();

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('oneLastStep')}</h1>
        <p className="text-center text-gray-600 mb-6">{t('finishSetup')}</p>
        <form onSubmit={handleSubmit} noValidate>
          {/* This FormField component needs to be defined or imported */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="companyName">{t('companyNameLabel')}</label>
            <input
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`}
              id="companyName" type="text"
              placeholder="e.g., GreenScapes Landscaping"
              value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-2" type="submit">
            {t('continue')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCompanyPage;