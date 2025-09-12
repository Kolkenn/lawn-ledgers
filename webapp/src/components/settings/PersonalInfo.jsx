import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { auth, db } from "../../firebase/config";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const PersonalSettings = ({ user, companyProfile }) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  // Determine if the form is dirty (i.e., if changes have been made)
  useEffect(() => {
    // The form is "dirty" if the trimmed input name is not the same as the original.
    const hasChanged = displayName.trim() !== (user?.displayName || "");
    setIsDirty(hasChanged);
  }, [displayName, user]);

  // Determine authentication provider configuration
  // This helps to manage whether fields are editable based on the provider
  // For example, users authenticated via Google SSO cannot change their email/name here
  // while those using email/password can.
  const authProviderConfig = useMemo(() => {
    const providerId = user?.providerData[0]?.providerId;
    switch (providerId) {
      case "password":
        return {
          isEditable: true,
          providerName: null,
        };
      case "google.com":
        return {
          isEditable: false,
          providerName: "Google",
        };
      // Future providers can be added here easily
      // case 'apple.com':
      //   return { isEditable: false, providerName: 'Apple' };
      default:
        return {
          isEditable: false,
          providerName: "an external provider",
        };
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", type: "" });
    if (displayName.trim() === "") {
      setStatusMessage({ text: "Name cannot be empty.", type: "error" });
      return;
    }
    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });
      // Map Member document in Firestore
      const memberDocRef = doc(
        db,
        "companies",
        companyProfile.id,
        "members",
        user.uid
      );
      // Update Firestore member document
      await updateDoc(memberDocRef, { displayName: displayName.trim() });

      setStatusMessage({ text: "Name updated successfully!", type: "success" });
      console.log("Name updated successfully");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsDirty(false);
      setStatusMessage({ text: "", type: "" });
    } catch (err) {
      setStatusMessage({ text: err.message, type: "error" });
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("personalInfo.title")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Label */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            {t("personalInfo.nameLabel")}
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClasses}
            disabled={!authProviderConfig.isEditable}
          />
        </div>
        {/* Email Label */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {t("personalInfo.emailLabel")}
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ""}
            className={inputClasses}
            disabled // Email is never editable here
          />
        </div>
        {/* SSO Notice */}
        {!authProviderConfig.isEditable && (
          <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-200">
            {t("personalInfo.ssoNotice", {
              provider: authProviderConfig.providerName,
            })}
          </p>
        )}
        {/* Save Button */}
        {isDirty && authProviderConfig.isEditable && (
          <div className="flex items-center justify-end space-x-4">
            {statusMessage.text && (
              <p
                className={`text-sm ${
                  statusMessage.type === "error"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {statusMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer disabled:bg-gray-400"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving
                ? t("personalInfo.savingChanges")
                : t("personalInfo.saveChanges")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalSettings;
