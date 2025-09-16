import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";

const TIER_PRICE_IDS = {
  starter: "price_1S7caTAMPnQQvgQLQXn5JZhT",
  growth: "price_1S7catAMPnQQvgQLc8tC044Q",
  pro: "price_1S7cb4AMPnQQvgQLENCcBfLV",
};

const SubscriptionSettings = ({ companyProfile, memberProfile }) => {
  const { t } = useTranslation();
  const isOwner = memberProfile?.role === "owner";
  const [isLoading, setIsLoading] = useState(false);

  // Determine the current plan and status from the company profile
  const currentPlan = companyProfile?.subscription?.planId || "Not Set";
  const subscriptionStatus = companyProfile?.subscription?.status || "inactive";
  const stripeCustomerId = companyProfile?.subscription?.stripeCustomerId;

  const handleSubscribe = async (priceId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, companyId: companyProfile.id }),
        }
      );
      const session = await response.json();
      // Redirect the user to the secure Stripe Checkout page
      window.location.href = session.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Could not initiate subscription. Please try again.");
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/stripe/create-portal-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripeCustomerId }),
        }
      );
      const session = await response.json();
      // Redirect the user to their secure Stripe Customer Portal
      window.location.href = session.url;
    } catch (error) {
      console.error("Error creating portal session:", error);
      alert("Could not open billing portal. Please try again.");
      setIsLoading(false);
    }
  };

  // Reusable component for displaying each plan
  const PlanCard = ({ tier, price, features, onSubscribe }) => (
    <div className="border rounded-lg p-6 flex flex-col hover:shadow-xl transition-shadow hover:bg-green-50 ">
      <h3 className="text-lg font-bold text-gray-800">{tier} Plan</h3>
      <p className="mt-2 text-3xl font-bold">
        ${price}
        <span className="text-base font-medium text-gray-500">/mo</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-gray-600 flex-grow">
        {features.map((f) => (
          <li key={f}>- {f}</li>
        ))}
      </ul>
      <button
        onClick={onSubscribe}
        disabled={isLoading || !isOwner}
        className="cursor-pointer mt-6 w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? "Loading..." : "Choose Plan"}
      </button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("settings.subscriptionInfo.title")}
      </h2>

      {subscriptionStatus === "active" ? (
        // --- VIEW FOR SUBSCRIBED USERS ---
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t("settings.subscriptionInfo.currentPlan")}
            </p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {currentPlan} Plan
            </p>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isLoading || !isOwner}
            className="cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Loading..."
              : t("settings.subscriptionInfo.manageButton")}
          </button>
        </div>
      ) : (
        // --- VIEW FOR NEW/UNSUBSCRIBED USERS ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard
            tier="Starter"
            price="49"
            features={["1 Admin Seat", "5 Field Seats", "Core Features"]}
            onSubscribe={() => handleSubscribe(TIER_PRICE_IDS.starter)}
          />
          <PlanCard
            tier="Growth"
            price="149"
            features={["5 Admin Seats", "20 Field Seats", "Route Optimization"]}
            onSubscribe={() => handleSubscribe(TIER_PRICE_IDS.growth)}
          />
          <PlanCard
            tier="Pro"
            price="299"
            features={[
              "15 Admin Seats",
              "Unlimited Field Seats",
              "QuickBooks Sync",
            ]}
            onSubscribe={() => handleSubscribe(TIER_PRICE_IDS.pro)}
          />
        </div>
      )}

      {!isOwner && (
        <p className="text-sm text-gray-500 mt-4">
          {t("settings.subscriptionInfo.ownerOnlyNotice")}
        </p>
      )}
    </div>
  );
};

export default SubscriptionSettings;
