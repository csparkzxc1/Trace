import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F1E8",
        "cream-deep": "#ECE5D3",
        paper: "#FAF7EE",
        ink: "#1F2A37",
        "ink-soft": "#4A5568",
        gold: "#B8924F",
        "gold-soft": "#D4B57A",
        burgundy: "#7A2E2E",
        sage: "#6B7F5A",
      },
      fontFamily: {
        display: ['"Noto Serif KR"', "serif"],
        body: ['"Gowun Dodum"', "system-ui", "sans-serif"],
        accent: ['"Cormorant Garamond"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
