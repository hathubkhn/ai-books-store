import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F5F0",
        surface: "#EFECE5",
        "surface-light": "#FCFBF8",
        foreground: "#191919",
        "foreground-secondary": "#57544E",
        accent: "#D97757",
        "accent-hover": "#C86446",
        "accent-soft": "#F2DED5",
        border: "#D8D4CB",
        success: "#476A55",
        warning: "#A06832",
        error: "#A9493D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};
export default config;
