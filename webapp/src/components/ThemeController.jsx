import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeController = () => {
  // Define your theme names
  const lightTheme = "emerald";
  const darkTheme = "forest";

  // 1. Initialize state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme;
      }
    }
    // Check system preference if no theme is stored
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? darkTheme
      : lightTheme;
  });

  // 2. Use an effect to apply the theme to the <html> tag and save it
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Handle the theme change on click
  const handleThemeChange = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <label
      className="swap swap-rotate btn btn-ghost btn-circle"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        onChange={handleThemeChange}
        checked={theme === darkTheme}
      />

      {/* Sun icon (light mode) */}
      <Moon className="swap-off h-6 w-6 fill-current" />

      {/* Moon icon (dark mode) */}
      <Sun className="swap-on h-6 w-6 fill-current" />
    </label>
  );
};

export default ThemeController;
