import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6200ee", // Material primary purple
          foreground: "#ffffff",
          light: "#bb86fc", // Light variant
          dark: "#3700b3", // Dark variant
        },
        secondary: {
          DEFAULT: "#03dac6", // Material secondary teal
          foreground: "#000000",
          light: "#66fff9", // Light variant
          dark: "#00a896", // Dark variant
        },
        destructive: {
          DEFAULT: "#cf6679", // Material error
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f5f5f5", // Material grey 100
          foreground: "#616161", // Material grey 700
        },
        accent: {
          DEFAULT: "#018786", // Material variant
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        surface: "#ffffff",
        "surface-variant": "#e7e0ec",
        "on-surface": "#1c1b1f",
        "on-surface-variant": "#49454f",
        outline: "#79747e",
        elevation: {
          1: "0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.14)",
          2: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14)",
          3: "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14)",
          4: "0px 5px 8px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14)",
        },
      },
      borderRadius: {
        lg: "16px", // Material rounded corners
        md: "8px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ripple: "ripple 0.6s linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

