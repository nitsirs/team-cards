import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sarabun)", "sans-serif"],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(blue|green|orange|yellow|purple|pink|teal)-(100|400|500|600|700)$/,
    },
  ],
};

export default config;
