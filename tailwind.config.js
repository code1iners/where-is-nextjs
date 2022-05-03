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
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        baam: {
          "0%": { transform: "scale(0)" },
          "60%": { transform: "scale(1.1)" },
          "80%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "reverse-y": {
          "0%": { transform: "rotateY(360deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        loading: "loading 1s ease-in-out infinite",
        "spin-reverse": "spin-reverse 0.5s linear infinite",
        "waving-hand": "wave 2s linear infinite",
        baam: "baam 0.5s ease-in-out forwards",
        "reverse-y": "reverse-y 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};
