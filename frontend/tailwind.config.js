import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        lightBusiness: {
          // 1. Inherit existing theme
          ...require("daisyui/src/theming/themes")["business"],
          // 2. Override specific colors
          neutral: "#D5DBE2",
          "neutral-content": "#36424E",
          "base-100": "#f3f4f6",
          "base-200": "#696969",
          "base-300": "#242424",
          "base-content": "#36424E",
          // primary: "#000000",
          // secondary: "#ffffff",
          // // 3. Override base colors
          // "base-100": "#f3f4f6",
        },
      },
      "business",
    ],
    darkTheme: "business",
  },
};
