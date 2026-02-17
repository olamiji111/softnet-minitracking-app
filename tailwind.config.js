/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        white: {
          DEFAULT: "#FFFFFF",
          50: "#FCFCFC",
          100: "#FDFDFD",
          200: "#FAFAFA",
          300: "#F8F8F8",
          400: "#F5F5F5",
          500: "#F0F0F0",
        },
        primary: {
          100: "#0061FF0A",
          200: "#0061FF1A",
          300: "#0061FF",
        },

      },
      fontFamily: {
        "inter-light": ["Inter_300Light", "sans-serif"],
        "inter-regular": ["Inter_400Regular", "sans-serif"],
        "inter-regular-italic": ["Inter_400Regular_Italic", "sans-serif"],
        "inter-medium": ["Inter_500Medium", "sans-serif"],
        "inter-medium-italic": ["Inter_500Medium_Italic", "sans-serif"],
        "inter-semibold": ["Inter_600SemiBold", "sans-serif"],
        "inter-semibold-italic": ["Inter_600SemiBold_Italic", "sans-serif"],
        "inter-bold": ["Inter_700Bold", "sans-serif"],
        "inter-bold-italic": ["Inter_700Bold_Italic", "sans-serif"],
        "inter-extrabold": ["Inter_800ExtraBold", "sans-serif"],
        "inter-extrabold-italic": ["Inter_800ExtraBold_Italic", "sans-serif"],
      },
    },
  },
  plugins: [],
}