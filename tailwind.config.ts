import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sedgwick: ['"Sedgwick Ave Display"', "cursive"],
      },
      backgroundImage: {
        "dot-matrix": "radial-gradient(circle, #dadada 1px, transparent 1px)",
        "under-construction": `
          repeating-linear-gradient(
            45deg, 
            #FFD700 0, 
            #FFD700 10px, 
            #ffc400 10px, 
            #ffc400 20px
          )
        `,
      },
      backgroundSize: {
        "dot-matrix": "30px 30px", // dot spacing
      },
    },
  },
  plugins: [],
};
export default config;
