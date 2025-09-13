import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to change the language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Close the dropdown after selection
  };

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Actual Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={t("language")}
        title={t("language")}
      >
        <Languages />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-md shadow-lg border w-36">
          <ul className="py-1">
            {/* English */}
            <li>
              <button
                onClick={() => changeLanguage("en")}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm ${
                  i18n.language.startsWith("en")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                English - ENG
              </button>
            </li>
            {/* Spanish */}
            <li>
              <button
                onClick={() => changeLanguage("es")}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm ${
                  i18n.language.startsWith("es")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Español - ESP
              </button>
            </li>
            {/* French */}
            <li>
              <button
                onClick={() => changeLanguage("es")}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm ${
                  i18n.language.startsWith("fr")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Français - FRA
              </button>
            </li>
            {/* Add new languages here in the future */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
