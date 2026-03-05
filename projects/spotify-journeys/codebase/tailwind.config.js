/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#121212',
          elevated: '#181818',
          highlight: '#282828',
          press: '#333333',
          tinted: '#1a1a1a',
          black: '#000000',
        },
        primary: {
          DEFAULT: '#1db954',
          hover: '#1ed760',
        },
        banner: {
          purple: '#6a35bd',
        },
        text: {
          base: '#ffffff',
          subdued: '#b3b3b3',
          faint: '#a7a7a7',
        }
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      }
    },
  },
  plugins: [],
}
