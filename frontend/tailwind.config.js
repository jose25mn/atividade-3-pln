/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        night: "#0a0a0b",
        panel: "#121214",
        line: "#232326",
        mist: "#a1a1aa",
        accent: "#22c55e",
        cyan: "#22d3ee",
        sand: "#facc15"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(34, 211, 238, 0.18), 0 18px 50px rgba(34, 211, 238, 0.12)"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
