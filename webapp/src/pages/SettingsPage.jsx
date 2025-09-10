//import CompanyProfileSettings from '../components/settings/CompanyProfileSettings';
//import IntegrationsSettings from '../components/settings/IntegrationsSettings';

const SettingsPage = ({ user, companyProfile, onProfileUpdate }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-10">
        {/* Placeholder for CompanyProfileSettings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <p>Edit company info form will go here.</p>
        </div>

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