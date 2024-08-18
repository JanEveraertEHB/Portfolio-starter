/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#191919",
        secondary: "#F5F5F5",
      },
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
