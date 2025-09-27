import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, KeyRound } from "lucide-react";
import { auth, db } from "../../firebase/config";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";

const PersonalSettings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [resetStatus, setResetStatus] = useState({ text: "", type: "" });

  useEffect(() => {
    const hasChanged = displayName.trim() !== (user?.displayName || "");
    setIsDirty(hasChanged);
  }, [displayName, user]);

  const authProviderConfig = useMemo(() => {
    const providerId = user?.providerData[0]?.providerId;
    switch (providerId) {
      case "password":
        return { isEditable: true, providerName: null };
      case "google.com":
        return { isEditable: false, providerName: "Google" };
      default:
        return { isEditable: false, providerName: "an external provider" };
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (Your existing handleSubmit logic remains unchanged) ...
  };

  const handlePasswordReset = async () => {
    setResetStatus({ text: "", type: "" });
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetStatus({
        text: t("settings.password.status.success"),
        type: "success",
      });
    } catch (error) {
      setResetStatus({
        text: t("settings.password.status.error"),
        type: "error",
      });
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Personal Information Section --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t("settings.personalInfo.title")}
        </h2>
        {/* Name Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {t("settings.personalInfo.nameLabel")}
            </span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input input-bordered w-full"
            disabled={!authProviderConfig.isEditable}
          />
        </div>
        {/* Email Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {t("settings.personalInfo.emailLabel")}
            </span>
          </label>
          <input
            type="email"
            value={user?.email || ""}
            className="input input-bordered w-full"
            disabled
          />
        </div>

        {/* SSO Notice */}
        {!authProviderConfig.isEditable && (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              {t("settings.personalInfo.ssoNotice", {
                provider: authProviderConfig.providerName,
              })}
            </span>
          </div>
        )}

        {/* Save Button */}
        {isDirty && authProviderConfig.isEditable && (
          <div className="flex items-center justify-end gap-4">
            {statusMessage.text && (
              <span
                className={`text-sm ${
                  statusMessage.type === "error" ? "text-error" : "text-success"
                }`}
              >
                {statusMessage.text}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-success"
            >
              <Save size={16} />
              {isSaving
                ? t("settings.personalInfo.savingChanges")
                : t("settings.personalInfo.saveChanges")}
            </button>
          </div>
        )}
      </form>

      {/* --- Password Reset Section (Conditional) --- */}
      {authProviderConfig.providerName === null && (
        <div className="space-y-4 pt-6 border-t border-base-300">
          <h2 className="text-xl font-semibold">
            {t("settings.password.title")}
          </h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {t("settings.password.description")}
              </span>
            </label>
            <button
              onClick={handlePasswordReset}
              className="btn btn-outline w-full sm:w-auto"
            >
              <KeyRound size={16} />
              {t("settings.password.buttonText")}
            </button>
          </div>
          {resetStatus.text && (
            <div
              className={`alert ${
                resetStatus.type === "error" ? "alert-error" : "alert-success"
              }`}
            >
              <span>{resetStatus.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalSettings;
