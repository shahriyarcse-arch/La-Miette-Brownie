import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crumb: "#F7F1E5",
        ink: {
          DEFAULT: "#221B12",
          soft: "#4A3F2E",
        },
        honey: "#D9A441",
        caramel: "#B06A2C",
        accent: "#C9853B",
        bakery: {
          dark: "#221B12",
          espresso: "#1A1412",
          crust: "#4A3F2E",
          warm: "#B06A2C",
          amber: "#D9A441",
          gold: "#D9A441",
          wheat: "#F7F1E5",
          cream: "#F7F1E5",
          flour: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
