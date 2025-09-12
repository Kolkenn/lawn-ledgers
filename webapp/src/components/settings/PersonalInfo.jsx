import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCircle2, CreditCard, Save } from 'lucide-react';

const PersonalSettings = ({ user }) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  // Check the user's sign-in method.
  const providerId = user?.providerData[0]?.providerId;
  const isEmailPasswordUser = providerId === 'password';
  const providerName = providerId === 'google.com' ? 'Google' : 'your SSO provider';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: Add logic to call Firebase's updateProfile function.
    setIsSaving(true);
    console.log("Saving user profile...", { displayName });
    setTimeout(() => setIsSaving(false), 1500); // Simulate save
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('personalInfo.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Label */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">{t('personalInfo.nameLabel')}</label>
          <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClasses} disabled={!isEmailPasswordUser} />
        </div>
        {/* Email Label */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('personalInfo.emailLabel')}</label>
          <input type="email" id="email" value={user?.email || ''} className={inputClasses} disabled />
        </div>
        {/* SSO Notice */}
        {!isEmailPasswordUser && (
            <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-200">{t('personalInfo.ssoNotice' , { provider: providerName })}</p>
        )}
        {/* Save Button */}
        {isEmailPasswordUser && (
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : t('personalInfo.saveChanges')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalSettings;