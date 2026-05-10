/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
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
        display: ["NotoSerifKR_500Medium"],
        "display-bold": ["NotoSerifKR_700Bold"],
        body: ["GowunDodum_400Regular"],
        accent: ["CormorantGaramond_500Italic"],
        "accent-bold": ["CormorantGaramond_600SemiBold"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
