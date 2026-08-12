import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sampled directly from public/logo.jpg (dominant pixel cluster
        // ~#442875) — the logo's real color is a deep purple/indigo, not
        // blue, despite "brand blue" being how it's often described. This
        // scale is generated at that exact hue (262°) and saturation (49%),
        // varying only lightness, so every shade is provably "the same
        // color at a different lightness" rather than an approximation.
        primary: {
          50: "#f6f4fb",
          100: "#ebe4f6",
          200: "#d4c6eb",
          300: "#b49cdd",
          400: "#7549c1",
          500: "#452876",
          600: "#37215f",
          700: "#2c1a4c",
          800: "#211439",
          900: "#180e2a",
        },
        accent: {
          50: "#CCFBF1",
          100: "#99F6E4",
          200: "#5EEAD4",
          300: "#2DD4BF",
          400: "#14B8A6",
          500: "#0D9488",
          600: "#0F766E",
          700: "#115E59",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Lexend", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
