/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: "#1F3A24",
        sprout: "#5B8C51",
        turmeric: "#D9A527",
        rust: "#B3452C",
        husk: "#F2EEE1",
        paper: "#FBF9F3",
        ink: "#22281E",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
