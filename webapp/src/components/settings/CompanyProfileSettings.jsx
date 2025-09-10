import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, storage, auth } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Save, UploadCloud } from 'lucide-react';

const CompanyProfileSettings = ({ companyProfile, memberProfile, onProfileUpdate }) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({ companyName: '', address: '', city: '', state: '', zip: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(companyProfile?.logoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isOwner = memberProfile?.role === 'owner';

  useEffect(() => {
    if (companyProfile) {
      setFormState({
        companyName: companyProfile.companyName || '',
        address: companyProfile.address || '',
        city: companyProfile.city || '',
        state: companyProfile.state || '',
        zip: companyProfile.zip || '',
      });
      setLogoPreview(companyProfile.logoUrl || '');
    }
  }, [companyProfile]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    const user = auth.currentUser;
    if (!user) return;

    try {
      let logoUrl = companyProfile?.logoUrl || '';

      // 1. If a new logo file was selected, upload it
      if (logoFile) {
        const storageRef = ref(storage, `company_logos/${user.uid}/${logoFile.name}`);
        const snapshot = await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Prepare the data to update in Firestore
      const updatedData = { ...formState, logoUrl };

      // 3. Update the document in Firestore
      const companyDocRef = doc(db, 'companies', user.uid);
      await updateDoc(companyDocRef, updatedData);

      // 4. Update the local state in the parent App component
      onProfileUpdate({ ...companyProfile, ...updatedData });
      setSuccessMessage(t('settings.profileUpdated'));

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
      // Clear the success message after a few seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('settings.companyInfo')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">{t('settings.companyNameLabel')}</label>
            <input type="text" id="companyName" value={formState.companyName} onChange={handleInputChange} className={inputClasses} disabled={!isOwner} />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('settings.addressLabel')}</label>
            <input type="text" id="address" value={formState.address} onChange={handleInputChange} className={inputClasses} disabled={!isOwner} />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('settings.cityLabel')}</label>
            <input type="text" id="city" value={formState.city} onChange={handleInputChange} className={inputClasses} disabled={!isOwner} />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">{t('settings.stateLabel')}</label>
            <input type="text" id="state" value={formState.state} onChange={handleInputChange} className={inputClasses} disabled={!isOwner} />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">{t('settings.zipLabel')}</label>
            <input type="text" id="zip" value={formState.zip} onChange={handleInputChange} className={inputClasses} disabled={!isOwner} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('settings.logoLabel')}</label>
          <div className="mt-1 flex items-center space-x-6">
            {/* ... logo preview ... */}
            <label htmlFor="logoUpload" className={`cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 ${!isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <UploadCloud className="inline-block w-5 h-5 mr-2" />
              {t('settings.changeLogo')}
            </label>
            <input id="logoUpload" name="logoUpload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="sr-only" disabled={!isOwner} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{t('settings.logoHelper')}</p>
        </div>

        <div className="flex items-center justify-end space-x-4">
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            {isOwner && ( // Only show the save button to owners
              <button type="submit" disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Saving...' : t('settings.saveChanges')}
              </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default CompanyProfileSettings;