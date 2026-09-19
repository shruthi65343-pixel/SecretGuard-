/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#060913",
          panel: "#0d1527",
          border: "rgba(255, 255, 255, 0.08)",
        }
      }
    },
  },
  plugins: [],
}
