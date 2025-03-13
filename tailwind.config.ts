import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        neutral: "var(--neutral)",
        surface: {
          light: "var(--surface-light)",
          DEFAULT: "var(--surface)",
          dark: "var(--surface-dark)",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "blue-500",
          secondary: "#64748B",
          accent: "#EFF6FF",
          neutral: "#334155",
          "base-100": "#FFFFFF",
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        dark: {
          primary: "blue-500",
          secondary: "#94A3B8",
          accent: "#1E293B",
          neutral: "#CBD5E1",
          "base-100": "#1E293B",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",
        },
      },
    ],
  },
} satisfies Config;
