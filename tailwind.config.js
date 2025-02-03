/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    colors: {
      covenTeal: "#094351",
      covenPurple: "#301933",
      covenLightPurple: "#4F1D4D",
      covenRed: "#8B0000",
    },
    textColor: {
      'on-light': '#1a1a1a', // Dark text for light backgrounds
    }
  },
};
export const plugins = [];
