import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MunicipaLogic Brand Colors
        // City-Friendly + Trustworthy Palette
        // Municipal governments respond better to serious, clean palettes.
        
        // Primary Colors
        "gov-blue": "#0F3D91",      // Government Blue - trust & government
        "civic-teal": "#2AA9A1",    // Civic Teal - modern & tech
        "charcoal": "#1E1E1E",      // Charcoal Gray - stability
        
        // Secondary Colors
        "fiscal-gold": "#D6A329",   // Fiscal Gold - savings & finances
        "logic-mint": "#C9F1E1",    // Logic Mint - subtle accents
        "soft-slate": "#E5EAF0",    // Soft Slate - light backgrounds & text
      },
    },
  },
  plugins: [],
};
export default config;

