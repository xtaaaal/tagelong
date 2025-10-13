import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Brand Colors - Tagelong Orange (#F69E20)
        brand: {
          50: "#fef9e7",   // Very light orange
          100: "#fef3c7",  // Light orange
          200: "#fde68a",  // Light orange
          300: "#fcd34d",  // Medium-light orange
          400: "#f9b84c",  // Medium orange
          500: "#F69E20",  // Main brand orange (Tagelong primary)
          600: "#d97917",  // Dark orange
          700: "#b45309",  // Darker orange
          800: "#92400e",  // Very dark orange
          900: "#78350f",  // Darkest orange
        },
        // Secondary Navy Color (#232939)
        navy: {
          50: "#f8f9fb",   // Very light navy
          100: "#f1f3f7",  // Light navy
          200: "#e4e8ef",  // Light navy
          300: "#d1d7e3",  // Medium-light navy
          400: "#9ca5b8",  // Medium navy
          500: "#232939",  // Main navy (Tagelong secondary)
          600: "#1e2330",  // Dark navy
          700: "#191d27",  // Darker navy
          800: "#14171e",  // Very dark navy
          900: "#0f1115",  // Darkest navy
        },
        // Custom Text Colors
        text: {
          primary: "#1D1D1D",    // Main text color
          secondary: "#6b7280",  // Secondary text (gray-500)
          muted: "#9ca3af",      // Muted text (gray-400)
          inverse: "#ffffff",    // White text for dark backgrounds
        },
        // Custom Accent Colors
        tagelong: {
          pink: "#ec4899",   // Pink accent (matches your gradient)
          purple: "#8b5cf6", // Purple accent
          blue: "#3b82f6",   // Blue accent
          green: "#10b981",  // Green accent
          yellow: "#f59e0b", // Yellow accent
        },
        // Keep existing ShadCN colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
