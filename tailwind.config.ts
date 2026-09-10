import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta SP Academia. Valores em app/globals.css (:root).
        noite: {
          50: "var(--noite-50)",
          100: "var(--noite-100)",
          200: "var(--noite-200)",
          300: "var(--noite-300)",
          400: "var(--noite-400)",
          500: "var(--noite-500)",
          600: "var(--noite-600)", // Azul Real
          700: "var(--noite-700)",
          800: "var(--noite-800)", // Azul Noite
        },
        areia: {
          50: "var(--areia-50)",
          100: "var(--areia-100)",
          200: "var(--areia-200)",
          300: "var(--areia-300)",
        },
        dourado: {
          200: "var(--dourado-200)",
          400: "var(--dourado-400)",
          500: "var(--dourado-500)",
          700: "var(--dourado-700)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          faint: "var(--ink-faint)",
        },
        success: "var(--success)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Azul Noite → Azul Real. É este o gradiente dos botões principais.
        "noite-foil":
          "linear-gradient(135deg, var(--noite-800), var(--noite-600))",
        "noite-gradient":
          "linear-gradient(135deg, var(--noite-50), var(--noite-100))",
        "noite-gradient-rich":
          "linear-gradient(135deg, var(--noite-100), var(--noite-200))",
      },
    },
  },
  plugins: [],
};

export default config;
