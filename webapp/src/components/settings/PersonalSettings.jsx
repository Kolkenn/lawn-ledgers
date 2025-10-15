import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, Info } from "lucide-react";
import { auth, db } from "../../firebase/config";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";

const PersonalSettings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", type: "" });
    if (displayName.trim() === "") {
      setStatusMessage({
        text: t("settings.personalInfo.status.empty"),
        type: "error",
      });
      return;
    }
    setIsSaving(true);
    try {
      const newName = displayName.trim();

      // 1. Update the master profile in Firebase Authentication
      await updateProfile(auth.currentUser, { displayName: newName });

      // 2. Fetch all of the user's company memberships
      const membershipsRef = collection(db, "users", user.uid, "memberships");
      const membershipSnapshot = await getDocs(membershipsRef);

      // 3. Create a batch write to update all member documents atomically
      const batch = writeBatch(db);
      membershipSnapshot.forEach((membershipDoc) => {
        const companyId = membershipDoc.data().companyId;
        const memberDocRef = doc(
          db,
          "companies",
          companyId,
          "members",
          user.uid
        );
        batch.update(memberDocRef, { displayName: newName });
      });

      // 4. Commit the batch
      await batch.commit();

      setStatusMessage({
        text: t("settings.personalInfo.status.success"),
        type: "success",
      });
      console.log("Profile updated successfully across all memberships.");
    } catch (err) {
      setStatusMessage(t("settings.personalInfo.status.error"));
      console.error("Error updating profile:", err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate a short delay for UX
      setStatusMessage({ text: "", type: "" });
      setIsDirty(false);
      setIsSaving(false);
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
            <Info />
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
    </div>
  );
};

export default PersonalSettings;
