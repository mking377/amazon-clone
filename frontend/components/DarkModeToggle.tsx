/*
"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const t = useTranslations("root"); // تأكد أن ملفات الترجمة فيها keys: darkMode و lightMode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) setDarkMode(savedMode === "true");
    else setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className={`
        ${className ?? ""}
        px-3 py-2
        rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-900 dark:text-gray-100
        shadow hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-colors duration-300
      `}
    >
      {darkMode ? `🌙 ${t("darkMode")}` : `☀️ ${t("lightMode")}`}
    </button>
  );
}
*/





"use client";
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) setDarkMode(savedMode === "true");
    else setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="
        px-3 py-2
        rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-900 dark:text-gray-100
        shadow hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-colors duration-300
      "
    >
      {darkMode ? "🌙 Dark Mode" : " ☀️ Light Mode"}
    </button>
  );
}





/*

"use client";
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) setDarkMode(savedMode === "true");
    else setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="fixed top-4 left-4 z-50 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow hover:shadow-md transition"
    >
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

*/
