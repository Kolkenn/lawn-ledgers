import { useTranslation } from 'react-i18next';
import CompanyProfileSettings from '../components/settings/CompanyProfileSettings';
import PersonalSettings from '../components/settings/PersonalSettings';
import SubscriptionSettings from '../components/settings/SubscriptionSettings';
import IntegrationsSettings from '../components/settings/IntegrationsSettings';

const SettingsPage = ({ user, companyProfile, memberProfile, onProfileUpdate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="space-y-10">
        {/* Personal Settings Section */}
        <PersonalSettings user={user} />
        {/* Company Profile Settings Section */}
        <CompanyProfileSettings 
          companyProfile={companyProfile}
          memberProfile={memberProfile}
          onProfileUpdate={onProfileUpdate}
        />
        {/* Subscription Settings Section */}
        <SubscriptionSettings memberProfile={memberProfile} />
        {/* Integrations Settings Section */}
        <IntegrationsSettings 
            companyProfile={companyProfile}
            memberProfile={memberProfile}
        />
      </div>
    </div>
  );
};

export default SettingsPage;