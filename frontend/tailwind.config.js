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
          neutral: "#6b7e88", // was secondary
          // neutral: "#7c909a", // was secondary
          "neutral-content": "#fff",
          // "neutral-content": "#2e3440",
          "secondary-content": "#fff",
          secondary: "#4c566a", // was neutral
          accent: "#ea6947",
          "accent-content": "#fff",
        },
      },
      {
        business: {
          ...require("daisyui/src/theming/themes")["business"],
          accent: "#d56b1e",
          "accent-content": "#fff",
        },
      },
    ],
    darkTheme: "business",
  },
};
