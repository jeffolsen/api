import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

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

    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    if (theme !== "system" && theme !== systemPreference) {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.setAttribute(
        "data-theme",
        resolvedDaisyTheme("system"),
      );
    };
    systemPreference.addEventListener("change", handler);
    return () => systemPreference.removeEventListener("change", handler);
  }, [theme]);

  return (
    <div className="flex items-center gap-2 px-6">
      <SunIcon className="inline-block w-4 h-4" />
      <input
        type="checkbox"
        className="toggle toggle-sm"
        checked={resolvedDaisyTheme(theme) === DAISY_THEME.dark}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
      />
      <MoonIcon className="inline-block w-4 h-4" />
    </div>
  );
}
