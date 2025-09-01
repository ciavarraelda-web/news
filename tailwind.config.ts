import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [
    tailwindAnimate,
  ],
};

export default config;
