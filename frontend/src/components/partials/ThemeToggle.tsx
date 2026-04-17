import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const DAISY_THEME: Record<"light" | "dark", string> = {
  light: "lightBusiness",
  dark: "business",
};

function resolvedDaisyTheme(pref: ThemePreference): string {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DAISY_THEME.dark
      : DAISY_THEME.light;
  }
  return DAISY_THEME[pref];
}

function getInitialTheme(): ThemePreference {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", resolvedDaisyTheme(theme));

    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.setAttribute(
        "data-theme",
        resolvedDaisyTheme("system"),
      );
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemePreference)}
    >
      <option value="system">System Default</option>
      <option value="light">Light Mode</option>
      <option value="dark">Dark Mode</option>
    </select>
  );
}
