import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  // Function to change the language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dropdown dropdown-center dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle"
        aria-label={t("language")}
        title={t("language")}
      >
        <Languages />
      </div>
      {/* Dropdown menu */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow-sm"
      >
        {/* English */}
        <li>
          <button
            onClick={() => changeLanguage("en")}
            className={`btn w-full justify-start ${
              i18n.language.startsWith("en") ? "btn-disabled" : "btn-ghost"
            }`}
          >
            English
          </button>
        </li>
        {/* Spanish */}
        <li>
          <button
            onClick={() => changeLanguage("es")}
            className={`btn w-full justify-start ${
              i18n.language.startsWith("es") ? "btn-disabled" : "btn-ghost"
            }`}
          >
            Español
          </button>
        </li>
        {/* French */}
        <li>
          <button
            onClick={() => changeLanguage("fr")}
            className={`btn w-full justify-start ${
              i18n.language.startsWith("fr") ? "btn-disabled" : "btn-ghost"
            }`}
          >
            Français
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
