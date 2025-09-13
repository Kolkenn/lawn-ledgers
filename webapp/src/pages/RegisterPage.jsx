import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { handleGoogleSignIn, handleEmailSignUp } from "../firebase/authService";
import { useTranslation } from "react-i18next";

import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import FormField from "../components/FormField";
import { GoogleIcon } from "../components/icons/CustomIcons";
import LanguageSwitcher from "../components/LanguageSwitcher";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const [validation, setValidation] = useState({
    email: { isValid: true, message: "" },
    password: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    confirmPassword: { isValid: true, message: "" },
  });

  // --- Real-time Validation using useEffect Hooks ---
  // 1. Validate Email as the user types
  useEffect(() => {
    if (email === "") {
      // Don't show error on empty field
      setValidation((v) => ({ ...v, email: { isValid: true, message: "" } }));
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setValidation((v) => ({
      ...v,
      email: {
        isValid,
        message: isValid ? "" : "Please enter a valid email format.",
      },
    }));
  }, [email]);

  // 2. Validate Password strength as the user types
  const setPasswordValidation = (criteria) => {
    setValidation((v) => ({ ...v, password: criteria }));
  };
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  // 3. Validate Confirm Password field whenever password or confirmPassword changes
  useEffect(() => {
    if (confirmPassword === "") {
      setValidation((v) => ({
        ...v,
        confirmPassword: { isValid: true, message: "" },
      }));
      return;
    }
    const isValid = password === confirmPassword;
    setValidation((v) => ({
      ...v,
      confirmPassword: {
        isValid,
        message: isValid ? "" : "Passwords do not match.",
      },
    }));
  }, [password, confirmPassword]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // --- Start Validation ---
    if (fullName.trim() === "") {
      setError("A full name is required.");
      return;
    }
    if (!validation.email.isValid) {
      setError("Please enter a valid email address.");
      return;
    }
    const isPasswordStrong = Object.values(validation.password).every(Boolean);
    if (!isPasswordStrong) {
      setError("Password does not meet the required criteria.");
      return;
    }
    if (!validation.confirmPassword.isValid) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await handleEmailSignUp(email, password, fullName);
      // The onAuthStateChanged listener in App.jsx will handle the redirect
    } catch (err) {
      // The service re-throws the error, so we can catch it here to display to the user
      setError(err.message);
      console.error("Error during sign up:", err);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      {/* Main Container */}
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {t("auth.registerTitle")}
          </h1>
          <div className="my-4">
            <p className="text-center text-sm text-gray-500 mb-2">
              {t("auth.signUpWith")}
            </p>
            {/* SSO Buttons */}
            <div className="flex justify-center space-x-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="cursor-pointer w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                aria-label={t("auth.ssoButton", { provider: "Google" })}
                title={t("auth.ssoButton", { provider: "Google" })}
              >
                <GoogleIcon />
              </button>
              {/* Future providers like Apple, Facebook, etc., can be added here */}
            </div>
          </div>
          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">
              {t("auth.orContinueWithEmail")}
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Regular Registration Form */}
          <form onSubmit={handleSignUp} noValidate>
            {/* Name Field */}
            <FormField
              id="fullName"
              label={t("auth.nameLabel")}
              type="text"
              placeholder="e.g., Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {/* Email Field */}
            <FormField
              id="email"
              label={t("auth.emailLabel")}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!validation.email.isValid ? validation.email.message : ""}
            />
            {/* Password Field */}
            <div className="mb-2">
              <label
                className="block text-gray-700 font-bold mb-1"
                htmlFor="password"
              >
                {t("auth.passwordLabel")}
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrengthIndicator
                validation={validation.password}
                password={password}
              />
            </div>
            {/* Confirm Password Field */}
            <FormField
              id="confirmPassword"
              label={t("auth.confirmPasswordLabel")}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                !validation.confirmPassword.isValid
                  ? validation.confirmPassword.message
                  : ""
              }
            />
            {/* Submit Button */}
            <button
              className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              {t("auth.signUpButton")}
            </button>
            {/* Display general error messages */}
            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}
          </form>
          {/* Link to Login Page */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("auth.logInRedirect")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
