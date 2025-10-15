import CompanyInfoSettings from "../../components/settings/CompanyInfo";
import SubscriptionSettings from "../../components/settings/Subscription";
import IntegrationsSettings from "../../components/settings/Integrations";
// import TeamManagement from "../components/settings/TeamManagement";

const CompanySettingsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Company Profile Settings Section */}
      <CompanyInfoSettings />
      {/* Subscription Settings Section */}
      <SubscriptionSettings />
      {/* Integrations Settings Section */}
      <IntegrationsSettings />
    </div>
  );
};

export default CompanySettingsPage;
