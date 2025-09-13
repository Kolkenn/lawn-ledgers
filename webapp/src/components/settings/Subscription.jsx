import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";

const SubscriptionSettings = ({ memberProfile }) => {
  const { t } = useTranslation();
  const isOwner = memberProfile?.role === "owner";

  // Placeholder data for now
  const currentPlan = "Growth Plan";

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("subscriptionInfo.title")}
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("subscriptionInfo.currentPlan")}
            </p>
            <p className="text-lg font-bold text-gray-900">{currentPlan}</p>
          </div>
          <button
            disabled={!isOwner}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t("subscriptionInfo.manageButton")}
          </button>
        </div>
        {!isOwner && (
          <p className="text-sm text-gray-500">
            {t("subscriptionInfo.ownerOnlyNotice")}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSettings;
