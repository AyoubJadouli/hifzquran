import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("hifz-theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("hifz-theme", theme);
  }, [theme]);

  // Apply on mount
  useEffect(() => {
    const saved = localStorage.getItem("hifz-theme") || "dark";
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function setTheme(t) {
    setThemeState(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}