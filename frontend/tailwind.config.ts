import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        terminal: {
          green: { DEFAULT: "#059669", dark: "#00c087" },
          red: { DEFAULT: "#dc2626", dark: "#ef4444" },
          amber: { DEFAULT: "#d97706", dark: "#f59e0b" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
