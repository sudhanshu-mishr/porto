import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 5% 84%)",
        input: "hsl(240 5% 84%)",
        background: "hsl(42 20% 97%)",
        foreground: "hsl(240 10% 8%)",
        muted: {
          DEFAULT: "hsl(42 12% 92%)",
          foreground: "hsl(240 6% 40%)"
        }
      }
    }
  },
  plugins: []
};

export default config;
