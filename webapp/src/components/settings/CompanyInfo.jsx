import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Save, UploadCloud, Undo2 } from "lucide-react";

const CompanyInfoSettings = ({ companyProfile, memberProfile }) => {
  const { t } = useTranslation();
  const isOwner = memberProfile?.role === "owner";
  // Text Field State Management
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [originalFormState, setOriginalFormState] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  // Logo State Management
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: "", type: "" });

  // Update company information state when companyProfile prop changes
  useEffect(() => {
    if (companyProfile) {
      const initialState = {
        name: companyProfile.name || "",
        address: companyProfile.address || "",
        city: companyProfile.city || "",
        state: companyProfile.state || "",
        zip: companyProfile.zip || "",
      };
      setFormState(initialState);
      setOriginalFormState(initialState);
      setLogoPreview(companyProfile.logoUrl || "");
    }
  }, [companyProfile]);

  // Track changes to form state to set dirty flag
  useEffect(() => {
    if (originalFormState) {
      // Create a new object with all string values from the current form state trimmed.
      const trimmedFormState = {
        name: formState.name.trim(),
        address: formState.address.trim(),
        city: formState.city.trim(),
        state: formState.state.trim(),
        zip: formState.zip.trim(),
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
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  // Handle logo updates
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const companyId = companyProfile?.id;
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
    const companyId = companyProfile?.id;
    if (!companyId) return;

    try {
      const dataToUpdate = {
        name: formState.name.trim(),
        address: formState.address.trim(),
        city: formState.city.trim(),
        state: formState.state.trim(),
        zip: formState.zip.trim(),
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

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    // Main Container
    <div className="bg-white p-6 rounded-lg shadow-xl">
      {/* Title Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("settings.companyInfo.title")}
      </h2>
      {/* Company Logo Container */}
      <div>
        {/* Logo Label */}
        <label className="block text-sm font-medium text-gray-700">
          {t("settings.companyInfo.logoLabel")}
        </label>
        {/* Logo Container */}
        <div className="mt-1 flex items-center space-x-6">
          {/* Logo Image Display Box */}
          <div className="h-16 w-32 bg-gray-100 rounded-md flex items-center justify-center border">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo Preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500">Logo</span>
            )}
          </div>
          {/* Logo Upload Button */}
          <div className="flex flex-col">
            <label
              htmlFor="logoUpload"
              className={`cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                !isOwner ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <UploadCloud className="inline-block w-5 h-5 mr-2" />
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
                    ? "text-red-600"
                    : uploadMessage.type === "success"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {uploadMessage.text}
              </p>
            )}
          </div>
        </div>
        {/* Helper Text */}
        <p className="text-xs text-gray-500 mb-2 border-b pb-2 mt-2">
          {t("settings.companyInfo.logoHelper")}
        </p>
      </div>
      {/* Company Info Container */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Company Name Section */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t("settings.companyInfo.nameLabel")}
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleInputChange}
                className={inputClasses}
                disabled // Company name is never editable here
              />
            </div>
            {/* Company Address Section */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                {t("settings.companyInfo.addressLabel")}
              </label>
              <input
                type="text"
                id="address"
                value={formState.address}
                onChange={handleInputChange}
                className={inputClasses}
                disabled={!isOwner}
              />
            </div>
            {/* Company City Section */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                {t("settings.companyInfo.cityLabel")}
              </label>
              <input
                type="text"
                id="city"
                value={formState.city}
                onChange={handleInputChange}
                className={inputClasses}
                disabled={!isOwner}
              />
            </div>
            {/* Company State Section */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                {t("settings.companyInfo.stateLabel")}
              </label>
              <input
                type="text"
                id="state"
                value={formState.state}
                onChange={handleInputChange}
                className={inputClasses}
                disabled={!isOwner}
              />
            </div>
            {/* Company ZIP Section */}
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700"
              >
                {t("settings.companyInfo.zipLabel")}
              </label>
              <input
                type="text"
                id="zip"
                value={formState.zip}
                onChange={handleInputChange}
                className={inputClasses}
                disabled={!isOwner}
              />
            </div>
          </div>
          {/* Action Buttons Container */}
          <div className="flex items-center justify-end space-x-4">
            {/* Feedback Message */}
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
            {/* Button Control */}
            {isOwner && isDirty && (
              <div className="flex space-x-2">
                <button
                  type="button" // Important: type="button" prevents form submission
                  onClick={handleUndoChanges}
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  aria-label="Undo changes"
                  title="Undo changes"
                >
                  <Undo2 className="w-5 h-5 mr-2" />
                  Undo
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving
                    ? t("settings.companyInfo.savingChanges")
                    : t("settings.companyInfo.saveChanges")}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoSettings;
