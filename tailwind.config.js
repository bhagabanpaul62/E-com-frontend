import { join } from "path";

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(import.meta.dirname, "src/**/*.{js,jsx,ts,tsx}")],
  theme: {
    extend: {},
  },
  plugins: [],
};
