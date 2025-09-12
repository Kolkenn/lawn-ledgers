import { useTranslation } from 'react-i18next';
import CompanyInfoSettings from '../components/settings/CompanyInfo';
import PersonalSettings from '../components/settings/PersonalInfo';
import SubscriptionSettings from '../components/settings/Subscription';
import IntegrationsSettings from '../components/settings/Integrations';
import TeamManagement from '../components/settings/TeamManagement';

const SettingsPage = ({ user, companyProfile, memberProfile, onProfileUpdate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="space-y-10">
        {/* Personal Settings Section */}
        <PersonalSettings user={user} />
        {/* Company Profile Settings Section */}
        <CompanyInfoSettings 
          companyProfile={companyProfile}
          memberProfile={memberProfile}
          onProfileUpdate={onProfileUpdate}
        />
        {/* Team Management Section */}
        {/* <TeamManagement memberProfile={memberProfile} /> */}
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