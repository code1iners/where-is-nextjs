module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        loading: {
          "0%": { transform: "translateY(0px)" },
          "20%": { transform: "translateY(-5px)" },
          "30%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(-15px)" },
          "100%": { transform: "translateY(-0px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        loading: "loading 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};
