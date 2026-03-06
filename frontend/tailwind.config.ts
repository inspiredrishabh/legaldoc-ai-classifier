/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fefcf7",
          100: "#fdf6ea",
          200: "#f9ebce",
          300: "#f3dba8",
          400: "#eac87a",
          500: "#deb055",
          600: "#c9933c",
          700: "#a87533",
          800: "#885d2e",
          900: "#704c28",
          950: "#3d2713",
        },
        sepia: {
          50: "#faf6f0",
          100: "#f0e8d8",
          200: "#e0cfad",
          300: "#cdb07e",
          400: "#be9558",
          500: "#b1814a",
          600: "#9a6a3e",
          700: "#7f5235",
          800: "#6a4431",
          900: "#5a3a2b",
          950: "#321d16",
        },
        legal: {
          gold: "#c9a84c",
          brown: "#6b4226",
          maroon: "#800020",
          darkbrown: "#3e2215",
          cream: "#faf3e3",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Lora"', "Georgia", "serif"],
      },
      boxShadow: {
        parchment:
          "0 1px 3px 0 rgba(107, 66, 38, 0.1), 0 1px 2px -1px rgba(107, 66, 38, 0.1)",
        "parchment-md":
          "0 4px 6px -1px rgba(107, 66, 38, 0.1), 0 2px 4px -2px rgba(107, 66, 38, 0.1)",
        "parchment-lg":
          "0 10px 15px -3px rgba(107, 66, 38, 0.1), 0 4px 6px -4px rgba(107, 66, 38, 0.1)",
      },
      backgroundImage: {
        "parchment-grain":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        quill: "quill 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        quill: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
