import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hydro Gen color palette
        hydro: {
          bg: "#0A0F0D",
          card: "#111916",
          cardHover: "#162019",
          accent: "#00E676",
          accentDim: "#00C853",
          accentGlow: "rgba(0,230,118,0.15)",
          accentGlow2: "rgba(0,230,118,0.06)",
          text: "#E8F5E9",
          textMuted: "#81C784",
          textDim: "#4CAF50",
          border: "rgba(0,230,118,0.12)",
          borderHover: "rgba(0,230,118,0.3)",
          danger: "#FF5252",
          warning: "#FFD740",
          info: "#40C4FF",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        "fade-in-up": "fadeInUp 0.4s ease",
        "pulse-slow": "pulse 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
