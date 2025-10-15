import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { Save, UploadCloud, Undo2, Building2, MapPinHouse } from "lucide-react";
import FormField from "../FormField";

const CompanyInfoSettings = () => {
  const { activeRole, activeCompany } = useAuth();
  const { t } = useTranslation();
  const isOwner = activeRole === "owner";
  // Text Field State Management
  const [formState, setFormState] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const [originalFormState, setOriginalFormState] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  // Logo State Management
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: "", type: "" });

  // Update company information state when activeCompany prop changes
  useEffect(() => {
    if (activeCompany) {
      const initialState = {
        name: activeCompany.name || "",
        address: {
          street: activeCompany.address.street || "",
          city: activeCompany.address.city || "",
          state: activeCompany.address.state || "",
          zip: activeCompany.address.zip || "",
        },
      };
      setFormState(initialState);
      setOriginalFormState(initialState);
      setLogoPreview(activeCompany.logoUrl || "");
    }
  }, [activeCompany]);

  // Track changes to form state to set dirty flag
  useEffect(() => {
    if (originalFormState) {
      // Create a new object with all string values from the current form state trimmed.
      const trimmedFormState = {
        name: formState.name.trim(),
        address: {
          street: formState.address.street.trim(),
          city: formState.address.city.trim(),
          state: formState.address.state.trim(),
          zip: formState.address.zip.trim(),
        },
      };

      // Compare the stringified version of the trimmed state to the original state.
      // This ensures that only meaningful changes are detected.
      const hasChanged =
        JSON.stringify(trimmedFormState) !== JSON.stringify(originalFormState);
      setIsDirty(hasChanged);
    }
  }, [formState, originalFormState]);

  // Handle text field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keys = id.split(".");

    if (keys.length === 1) {
      // Handle top-level properties like 'id'
      setFormState((prev) => ({ ...prev, [id]: value }));
    } else {
      // Handle nested properties like 'address.street'
      setFormState((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };

  // Handle logo updates
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const companyId = activeCompany?.id;
    setUploadMessage({ text: "", type: "" });

    if (!file || !companyId || !isOwner) return;

    // Define constraints
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

    // Perform client-side checks
    if (file.size > MAX_FILE_SIZE) {
      setUploadMessage({
        text: t("settings.companyInfo.logoValidation.fileTooLarge"),
        type: "error",
      });
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadMessage({
        text: t("settings.companyInfo.logoValidation.invalidFileType"),
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExtension = file.name.split("settings..").pop();
      const storageRef = ref(
        storage,
        `${companyId}/logo/logo.${fileExtension}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const logoUrl = await getDownloadURL(snapshot.ref);

      // Update the logo URL in the company document
      await updateDoc(doc(db, "companies", companyId), { logoUrl: logoUrl });
      setLogoPreview(logoUrl);
      setUploadMessage({
        text: t("settings.companyInfo.logoStatus.success"),
        type: "success",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      setUploadMessage({
        text: t("settings.companyInfo.logoStatus.error"),
        type: "error",
      });
      console.error("Error uploading logo:", error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsUploading(false);
      setUploadMessage({ text: "", type: "" });
    }
  };

  // Handle text field changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ text: "", type: "" });
    const companyId = activeCompany?.id;
    if (!companyId) return;

    try {
      const dataToUpdate = {
        name: formState.name.trim(),
        address: {
          street: formState.address.street.trim(),
          city: formState.address.city.trim(),
          state: formState.address.state.trim(),
          zip: formState.address.zip.trim(),
        },
      };
      // Update the company document with the new form state
      await updateDoc(doc(db, "companies", companyId), dataToUpdate);
      setStatusMessage({
        text: t("settings.companyInfo.infoStatus.success"),
        type: "success",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFormState(dataToUpdate);
      setOriginalFormState(dataToUpdate);
    } catch (error) {
      setStatusMessage({
        text: t("settings.companyInfo.infoStatus.error"),
        type: "error",
      });
      console.error("Error updating profile:", error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setStatusMessage({ text: "", type: "" });
      setIsSaving(false);
    }
  };

  // Handle undo changes
  const handleUndoChanges = () => {
    if (originalFormState) {
      setFormState(originalFormState);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="text-xl card-title">
          {t("settings.companyInfo.title")}
        </h2>

        {/* Logo Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {t("settings.companyInfo.logoLabel")}
            </span>
          </label>
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-32 rounded bg-base-200 flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo Preview" />
                ) : (
                  <span className="text-xs text-base-content/60">No Logo</span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="logoUpload"
                className={`btn btn-sm ${!isOwner ? "btn-disabled" : ""}`}
              >
                <UploadCloud size={16} />
                {isUploading
                  ? t("settings.companyInfo.uploadingLogo")
                  : t("settings.companyInfo.changeLogo")}
              </label>
              <input
                id="logoUpload"
                name="logoUpload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleLogoUpload}
                className="sr-only"
                disabled={!isOwner || isUploading}
              />
              {uploadMessage.text && (
                <p
                  className={`text-xs mt-2 ${
                    uploadMessage.type === "error"
                      ? "text-error"
                      : "text-success"
                  }`}
                >
                  {uploadMessage.text}
                </p>
              )}
            </div>
          </div>
          <p className="label-text-alt">
            {t("settings.companyInfo.logoHelper")}
          </p>
        </div>

        <div className="divider"></div>

        {/* Company Info Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              id="name"
              label={t("settings.companyInfo.nameLabel")}
              type="text"
              value={formState.name}
              onChange={handleInputChange}
              disabled // Company name is not editable here
              icon={Building2}
            />
            <FormField
              id="address.street"
              label={t("settings.companyInfo.addressLabel")}
              type="text"
              value={formState.address.street}
              onChange={handleInputChange}
              disabled={!isOwner}
              icon={MapPinHouse}
            />
            <FormField
              id="address.city"
              label={t("settings.companyInfo.cityLabel")}
              type="text"
              value={formState.address.city}
              onChange={handleInputChange}
              disabled={!isOwner}
              icon={MapPinHouse}
            />
            <FormField
              id="address.state"
              label={t("settings.companyInfo.stateLabel")}
              type="text"
              value={formState.address.state}
              onChange={handleInputChange}
              disabled={!isOwner}
              icon={MapPinHouse}
            />
            <FormField
              id="address.zip"
              label={t("settings.companyInfo.zipLabel")}
              type="text"
              value={formState.address.zip}
              onChange={handleInputChange}
              disabled={!isOwner}
              icon={MapPinHouse}
            />
          </div>

          {isOwner && isDirty && (
            <div className="card-actions justify-end items-center gap-4">
              {statusMessage.text && (
                <p
                  className={`text-sm ${
                    statusMessage.type === "error"
                      ? "text-error"
                      : "text-success"
                  }`}
                >
                  {statusMessage.text}
                </p>
              )}
              <button
                type="button"
                onClick={handleUndoChanges}
                className="btn btn-ghost"
                aria-label="Undo changes"
                title="Undo changes"
              >
                <Undo2 size={16} />
                Undo
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-success"
              >
                <Save size={16} />
                {isSaving
                  ? t("settings.companyInfo.savingChanges")
                  : t("settings.companyInfo.saveChanges")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoSettings;
