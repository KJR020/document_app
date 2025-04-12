"use client";

import { FiMoon, FiSun } from "react-icons/fi";

import { useTheme } from "./ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 transition-colors hover:bg-base-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-base-content" />
      ) : (
        <FiMoon className="h-5 w-5 text-base-content" />
      )}
    </button>
  );
};
