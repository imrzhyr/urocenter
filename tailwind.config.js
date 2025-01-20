/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        'noto-sans-arabic': ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "#0066FF",
          '600': "#0052CC"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
} 