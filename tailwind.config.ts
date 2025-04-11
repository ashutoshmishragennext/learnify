import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      backgroundImage: {
        'custom-gradient': 'linear-gradient(90.18deg, #2D37DB 0%, #8223F6 95.74%)',

      },


      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        learnify: "#907CFF",
      },
    },
  },
  plugins: [],
} satisfies Config;
