/**************** Tailwind Config ****************/
/** Tailwind is pre-configured by the environment. **/
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#e5e7eb",
        accent: "#8b5cf6",
      }
    },
  },
  plugins: [],
};
