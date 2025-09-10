import { useTranslation } from 'react-i18next';
import CompanyProfileSettings from '../components/settings/CompanyProfileSettings';
//import IntegrationsSettings from '../components/settings/IntegrationsSettings';

const SettingsPage = ({ user, companyProfile, onProfileUpdate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="space-y-10">
        <CompanyProfileSettings 
          companyProfile={companyProfile}
          onProfileUpdate={onProfileUpdate}
        />

        {/* Placeholder for IntegrationsSettings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            <p>Stripe connection UI will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;