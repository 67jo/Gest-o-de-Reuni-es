/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand & Primary
        primary: "#00457a",
        "primary-container": "#285d93",
        "on-primary": "#ffffff",
        "primary-fixed": "#d2e4ff",
        "primary-fixed-dim": "#a0c9ff",
        "on-primary-fixed": "#001c37",
        "on-primary-fixed-variant": "#07497d",
        "inverse-primary": "#a0c9ff",

        // Secondary & Tertiary
        secondary: "#515f74",
        "secondary-container": "#d5e3fc",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#57657a",
        "secondary-fixed": "#d5e3fc",
        "secondary-fixed-dim": "#b9c7df",
        "on-secondary-fixed": "#0d1c2e",
        "on-secondary-fixed-variant": "#3a485b",
        
        tertiary: "#7b2600",
        "tertiary-container": "#a33500",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffc6b2",
        "tertiary-fixed": "#ffdbcf",
        "tertiary-fixed-dim": "#ffb59b",
        "on-tertiary-fixed": "#380d00",
        "on-tertiary-fixed-variant": "#812800",

        // Surface & Background
        background: "#f7f9fb",
        "on-background": "#191c1e",
        surface: "#f7f9fb",
        "on-surface": "#191c1e",
        "surface-variant": "#e0e3e5",
        "on-surface-variant": "#434654",
        "surface-bright": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-tint": "#2d6197",
        
        // Surface Containers
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",

        // Utility & Feedback
        outline: "#737685",
        "outline-variant": "#c3c6d6",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        // Mapeado conforme as classes usadas no seu HTML
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        // Fallbacks para os nomes que você já tinha
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}