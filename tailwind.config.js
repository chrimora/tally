/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: {
        light: "#CFDBD5",
        dark: "#291720",
      },
      primary: {
        light: "#B48291",
        dark: "#596F62",
      },
      accent: {
        light: "#F3B61F",
        dark: "#FB8B24",
      },
      green: {
        light: "#3DF583",
        dark: "#08A845",
      },
      red: {
        light: "#FF6259",
        dark: "#A82019",
      },
    },
  },
};
