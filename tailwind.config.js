/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // iPad Mini (768×1024) uses sm styles; md/lg start after 1024px
      screens: {
        md: "1025px",
        lg: "1025px",
      },
      fontFamily: {
        grotesk: ["Space Grotesk", "sans-serif"],
        spartan: ["League Spartan", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter","sans-serif"],
      },
      backgroundImage: {
        // bg-linear-to-b from-[#2e335a] to-[#1c1b33]
        "app-gradient": "linear-gradient(to bottom, #2e335a, #1c1b33)",
        // bg-linear-to-b from-[#3f2f74]/70 to-[#632da6]/70
        "header-gradient":
          "linear-gradient(to bottom, #3f2f74b3, #632da6b3)",
      },
      
    },
  },
  plugins: [],
};



