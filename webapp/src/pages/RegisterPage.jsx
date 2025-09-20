import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { handleGoogleSignIn, handleEmailSignUp } from "../firebase/authService";
import { useTranslation } from "react-i18next";

import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import FormField from "../components/FormField";
import { GoogleIcon } from "../components/icons/CustomIcons";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeController from "../components/ThemeController";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

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

  // Effect to manage the timer
  useEffect(() => {
    let interval;

    // Only start the interval if there is an error
    if (error) {
      // Reset countdown to 5 every time a new error is set
      setCountdown(5);

      interval = setInterval(() => {
        // Decrement countdown. We use the functional update form
        // to ensure we always have the latest state.
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // 1000ms = 1 second
    }

    // The cleanup function clears the interval when the component
    // unmounts or when the 'error' state changes.
    return () => clearInterval(interval);
  }, [error]); // This effect runs only when the 'error' state changes

  // Effect to clear the error when countdown finishes
  useEffect(() => {
    if (countdown === -1) {
      setError(null); // Clear the error message
    }
  }, [countdown]); // This effect runs whenever the countdown value changes

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
    <div className="bg-base h-screen flex items-center justify-center">
      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 space-x-2">
        <LanguageSwitcher />
        <ThemeController />
      </div>
      {/* Main Container */}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4">
        {/* Title */}
        <h1 className="text-2xl font-serif font-bold text-center mb-4">
          {t("auth.registerTitle")}
        </h1>
        <p className="text-center text-base mb-2">{t("auth.signUpWith")}</p>
        {/* SSO Buttons */}
        <div className="flex justify-center space-x-4">
          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="btn btn-square border-primary"
            aria-label={t("auth.ssoButton", { provider: "Google" })}
            title={t("auth.ssoButton", { provider: "Google" })}
          >
            <GoogleIcon />
          </button>
          {/* Future providers like Apple, Facebook, etc., can be added here */}
        </div>
        {/* Seperator */}
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="flex-shrink text-base mx-4">
            {t("auth.orContinueWithEmail")}
          </span>
          <div className="flex-grow border-t 0"></div>
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
            <label className="block text-base mb-1" htmlFor="password">
              {t("auth.passwordLabel")}
            </label>
            <input
              className="w-full px-3 py-2 border border-neutral rounded-md text-base"
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
            className="btn btn-primary text-base w-full mt-2"
            type="submit"
            aria-label={t("auth.signUpButton")}
          >
            {t("auth.signUpButton")}
          </button>
          {/* Display general error messages */}
          {error && (
            <div className="toast toast-end">
              <div className="alert alert-error flex justify-between">
                <span className="text-base">{error}</span>
                <span className="countdown text-lg">
                  <span style={{ "--value": countdown }}></span>
                </span>
              </div>
            </div>
          )}
        </form>
        {/* Link to Login Page */}
        {/* Register Button */}
        <button className="btn btn-secondary text-base mt-2 ">
          <Link to="/login">{t("auth.logInRedirect")}</Link>
        </button>
      </fieldset>
    </div>
  );
};

export default RegisterPage;
