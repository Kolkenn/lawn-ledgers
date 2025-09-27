import React from "react";

const SubscriptionBlocker = () => {
  return (
    <div className="fixed inset-0 bg-base-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card w-96 bg-base-200 shadow-xl text-center">
        <div className="card-body">
          <h2 className="card-title justify-center text-warning">
            Subscription Inactive
          </h2>
          <p>
            This company's subscription is not active. The application is
            currently unavailable.
          </p>
          <p className="mt-4 font-bold">
            Please contact your account owner to complete the subscription
            setup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBlocker;
