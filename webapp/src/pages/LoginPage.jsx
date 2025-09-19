import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { handleGoogleSignIn, handleEmailLogin } from "../firebase/authService";
import { useTranslation } from "react-i18next";

import FormField from "../components/FormField";
import { GoogleIcon } from "../components/icons/CustomIcons";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeController from "../components/ThemeController";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (email === "") {
      setIsEmailValid(true); // Don't show an error for an empty field
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(email));
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // A single, clean call to our abstracted service function
      await handleEmailLogin(email, password);
      // The onAuthStateChanged listener in App.jsx will handle the redirect
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Caught login error in component:", err);
    }
  };

  return (
    <div className="bg-base h-screen flex items-center justify-center">
      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 space-x-2">
        <LanguageSwitcher />
        <ThemeController />
      </div>
      {/* Login Fields/Card */}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4">
        <h1 className="text-xl font-bold text-center mb-4">
          {t("auth.loginTitle")}
        </h1>
        {/* Social Login Buttons */}
        <div>
          <p className="text-center text-sm mb-2">{t("auth.signInWith")}</p>
          <div className="flex justify-center space-x-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="btn btn-square"
              aria-label={t("auth.ssoButton", { provider: "Google" })}
              title={t("auth.ssoButton", { provider: "Google" })}
            >
              <GoogleIcon />
            </button>
            {/* Future social login buttons can be added here */}
          </div>
        </div>
        {/* Seperator */}
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="flex-shrink mx-4">
            {t("auth.orContinueWithEmail")}
          </span>
          <div className="flex-grow border-t 0"></div>
        </div>
        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <FormField
            id="email"
            label={t("auth.emailLabel")}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!isEmailValid ? "Please enter a valid email format." : ""}
          />
          {/* Password */}
          <FormField
            id="password"
            label={t("auth.passwordLabel")}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Error */}
          {error && (
            <div className="toast">
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            </div>
          )}
          <button
            className="btn btn-primary w-full mt-2"
            type="submit"
            aria-label={t("auth.logInButton")}
          >
            {t("auth.logInButton")}
          </button>
        </form>

        <div className="grid">
          {/* Register Button */}
          <button className="btn btn-secondary mb-2">
            <Link to="/register">{t("auth.signUpRedirect")}</Link>
          </button>
          {/* Reset Button */}
          <button className="btn btn-outline">{t("auth.resetRedirect")}</button>
        </div>
      </fieldset>
    </div>
  );
};

export default LoginPage;
