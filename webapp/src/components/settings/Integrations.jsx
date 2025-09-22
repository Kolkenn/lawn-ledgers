import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plug } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const IntegrationsSettings = ({ companyProfile }) => {
  const { activeCompany, activeRole } = useAuth();
  const { t } = useTranslation();
  const isOwner = activeRole === "owner";

  const [isConnected, setIsConnected] = useState(
    !!activeCompany?.stripeAccountId
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectStripe = async () => {
    setIsLoading(true);
    console.log("Simulating call to backend to get Stripe Connect URL...");
    setTimeout(() => {
      alert(
        "In a real app, you would now be redirected to Stripe to connect your account."
      );
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnectStripe = () => {
    if (
      window.confirm("Are you sure you want to disconnect your Stripe account?")
    ) {
      setIsConnected(false);
      console.log("Simulating disconnection...");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("settings.integrations.title")}
      </h2>
      <div className="space-y-4">
        <div className="flex items-start p-4 bg-gray-50 rounded-md border">
          <div className="flex-shrink-0 text-blue-600 pt-1">
            <Plug />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="text-lg font-bold text-gray-900">
              {t("settings.integrations.stripeConnectTitle")}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t("settings.integrations.stripeConnectDesc")}
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isConnected ? (
              <div className="text-center">
                <p className="text-sm font-bold text-green-700">
                  {t("settings.integrations.stripeConnected")}
                </p>
                {isOwner && (
                  <button
                    onClick={handleDisconnectStripe}
                    className="text-xs text-red-600 hover:underline"
                  >
                    {t("settings.integrations.stripeDisconnect")}
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnectStripe}
                disabled={!isOwner || isLoading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Connecting..."
                  : t("settings.integrations.stripeConnectButton")}
              </button>
            )}
          </div>
        </div>
        {!isOwner && !isConnected && (
          <p className="text-sm text-gray-500">
            {t("settings.subscriptionInfo.ownerOnlyNotice")}
          </p>
        )}
      </div>
    </div>
  );
};

export default IntegrationsSettings;
