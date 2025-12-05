/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        orion: {
          primary: "#0B0F3B",
          blue: "#3C5AFE",
          cyan: "#4CD7F6",
          success: "#00C48C",
          warning: "#F7C948",
          danger: "#FF4D4F",
          light: "#EAEAEA"
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 15, 59, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
}

