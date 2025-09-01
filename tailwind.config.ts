import { defineConfig } from "tailwindcss";

export default defineConfig({
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
});
