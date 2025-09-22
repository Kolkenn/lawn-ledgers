import CompanyInfoSettings from "../components/settings/CompanyInfo";
import PersonalSettings from "../components/settings/PersonalInfo";
import SubscriptionSettings from "../components/settings/Subscription";
import IntegrationsSettings from "../components/settings/Integrations";
// import TeamManagement from "../components/settings/TeamManagement";

const SettingsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Personal Settings Section */}
      <PersonalSettings />
      {/* Company Profile Settings Section */}
      <CompanyInfoSettings />
      {/* Team Management Section */}
      {/* <TeamManagement memberProfile={memberProfile} /> */}
      {/* Subscription Settings Section */}
      <SubscriptionSettings />
      {/* Integrations Settings Section */}
      <IntegrationsSettings />
    </div>
  );
};

export default SettingsPage;
