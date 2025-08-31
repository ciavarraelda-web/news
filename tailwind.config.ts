import { defineConfig } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default defineConfig({
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
});
