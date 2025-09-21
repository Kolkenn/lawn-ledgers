import { useTranslation } from "react-i18next";
import CompanyInfoSettings from "../components/settings/CompanyInfo";
import PersonalSettings from "../components/settings/PersonalInfo";
import SubscriptionSettings from "../components/settings/Subscription";
import IntegrationsSettings from "../components/settings/Integrations";
import { useAuth } from "../context/AuthContext";
// import TeamManagement from "../components/settings/TeamManagement";

const SettingsPage = () => {
  const { user, companyProfile, memberProfile } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Settings Section */}
        <PersonalSettings user={user} companyProfile={companyProfile} />
        {/* Company Profile Settings Section */}
        <CompanyInfoSettings
          companyProfile={companyProfile}
          memberProfile={memberProfile}
        />
        {/* Team Management Section */}
        {/* <TeamManagement memberProfile={memberProfile} /> */}
        {/* Subscription Settings Section */}
        <SubscriptionSettings
          companyProfile={companyProfile}
          memberProfile={memberProfile}
        />
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
