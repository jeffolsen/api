import daisyui from "daisyui";
// import typeography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
  daisyui: {
    themes: [
      {
        nord: {
          // 1. Inherit existing theme
          ...require("daisyui/src/theming/themes")["nord"],
          // 2. Override specific colors
          "primary-content": "#fff",
          neutral: "#7c909a", // was secondary
          "secondary-content": "#fff",
          secondary: "#4c566a", // was neutral
          "neutral-content": "#fff",
          accent: "#ea6947",
          "accent-content": "#fff",
        },
      },
      "business",
    ],
    darkTheme: "business",
  },
};
