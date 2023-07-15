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
        light: "#FDF6E3",
        dark: "#2D353B",
      },
      bgdim: {
        light: "#EFEBD4",
        dark: "#232A2E",
      },
      primary: {
        light: "#5C6A72",
        dark: "#D3C6AA",
      },
      accent: {
        light: "#93B259",
        dark: "#A7C080",
      },
      green: {
        light: "#8DA101",
        dark: "#A7C080",
      },
      red: {
        light: "#F85552",
        dark: "#E67E80",
      },
    },
  },
};
