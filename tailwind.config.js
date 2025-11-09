/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1e293b",
        border: "#cbd5e1",
        ring: "#475569",
        card: "#ffffff",
        "card-foreground": "#1e293b",
        popover: "#ffffff",
        "popover-foreground": "#1e293b",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#10b981",
        "secondary-foreground": "#1e293b",
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        accent: "#ef4444",
        "accent-foreground": "#ffffff",
        destructive: "#dc2626",
        input: "#f9fafb",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
