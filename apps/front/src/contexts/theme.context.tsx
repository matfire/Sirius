import React, { createContext, useEffect, useState } from "react";

interface ThemeContext {
  theme: string;
  toggleTheme: () => void;
}

export const themeContext = createContext<ThemeContext>({
  theme: "dark",
  toggleTheme: () => {},
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (localStorage.getItem("sirius_theme"))
      setTheme(localStorage.getItem("sirius_theme")!);
  }, []);

  const toggleTheme = () => {
    localStorage.setItem("sirius_theme", theme === "dark" ? "light" : "dark");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
}
