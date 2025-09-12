import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Save, UploadCloud } from "lucide-react";

const CompanyInfoSettings = ({
  companyProfile,
  memberProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(companyProfile?.logoUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [originalFormState, setOriginalFormState] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const isOwner = memberProfile?.role === "owner";

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

  useEffect(() => {
    if (originalFormState) {
      const hasChanged =
        JSON.stringify(formState) !== JSON.stringify(originalFormState);
      setIsDirty(hasChanged);
    }
  }, [formState, originalFormState]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file); // Store the file object
      setLogoPreview(URL.createObjectURL(file)); // Create a temporary local URL for the preview
      setUploadStatus(t("companyInfo.logoUploaded")); // Provide instant feedback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ text: "", type: "" });
    setUploadStatus("");
    const companyId = companyProfile?.id;

    try {
      // let logoUrl = companyProfile?.logoUrl || "";

      // // Upload new logo if a file is selected
      // if (logoFile) {
      //   setUploadStatus(t("companyInfo.uploadingLogo"));
      //   const storageRef = ref(
      //     storage,
      //     `${companyId}/logo/logo.${logoFile.name.split(".").pop()}`
      //   );
      //   const snapshot = await uploadBytes(storageRef, logoFile);
      //   logoUrl = await getDownloadURL(snapshot.ref);
      //   setUploadStatus(""); // Clear status on success
      // }

      const updatedData = { ...formState };
      const companyDocRef = doc(db, "companies", companyId);
      await updateDoc(companyDocRef, updatedData);

      onProfileUpdate({ ...companyProfile, ...updatedData });
      setStatusMessage({
        text: t("companyInfo.status.success"),
        type: "success",
      });
      setLogoFile(null); // Clear the temporary file state
    } catch (error) {
      setStatusMessage(t("companyInfo.status.error"));
      console.error("Error updating profile:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate a short delay for UX
      setStatusMessage({ text: "", type: "" });
      setIsDirty(false);
      setIsSaving(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    // Main Container
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Title Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("companyInfo.title")}
      </h2>
      {/* Company Info Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name Section */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {t("companyInfo.nameLabel")}
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleInputChange}
              className={inputClasses}
              disabled={!isOwner}
            />
          </div>
          {/* Company Address Section */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              {t("companyInfo.addressLabel")}
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
              {t("companyInfo.cityLabel")}
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
              {t("companyInfo.stateLabel")}
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
              {t("companyInfo.zipLabel")}
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
        {/* Company Logo Container */}
        <div>
          {/* Logo Label */}
          <label className="block text-sm font-medium text-gray-700">
            {t("companyInfo.logoLabel")}
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
                {t("companyInfo.changeLogo")}
              </label>
              <input
                id="logoUpload"
                name="logoUpload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="sr-only"
                disabled={!isOwner}
              />
              {uploadStatus && (
                <p className="text-xs text-gray-500 mt-2">{uploadStatus}</p>
              )}
            </div>
          </div>
          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-2">
            {t("companyInfo.logoHelper")}
          </p>
        </div>
        {/* Action Buttons Container */}
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
          {isOwner && isDirty && (
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving
                ? t("companyInfo.savingChanges")
                : t("companyInfo.saveChanges")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoSettings;
