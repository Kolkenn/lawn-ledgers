import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

const Requirement = ({ met, text }) => {
  // We use a transition on the color and height to make changes smooth
  const baseClasses =
    "flex items-center transition-colors duration-300 ease-in-out";
  const metClasses = "text-success";
  const unmetClasses = "text-error";

  return (
    <li className={`${baseClasses} ${met ? metClasses : unmetClasses}`}>
      {met ? (
        <Check className="w-5 h-5 mr-2 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 mr-2 flex-shrink-0" />
      )}
      <span>{text}</span>
    </li>
  );
};

const PasswordStrengthIndicator = ({ validation, password }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // We show the indicator if the user has started typing
    if (password.length > 0) {
      setIsVisible(true);
    } else {
      // Otherwise, we hide it
      setIsVisible(false);
    }
  }, [password]);

  return (
    <div
      className={`transition-all duration-1000 ease-in-out overflow-hidden ${
        isVisible ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
      }`}
    >
      <div className="mt-2 text-xs">
        <Requirement
          met={validation.length}
          text={t("auth.passwordRequirements.length")}
        />
        <Requirement
          met={validation.uppercase}
          text={t("auth.passwordRequirements.uppercase")}
        />
        <Requirement
          met={validation.lowercase}
          text={t("auth.passwordRequirements.lowercase")}
        />
        <Requirement
          met={validation.number}
          text={t("auth.passwordRequirements.number")}
        />
        <Requirement
          met={validation.special}
          text={t("auth.passwordRequirements.special")}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
