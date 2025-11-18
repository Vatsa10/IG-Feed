/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        'pink': {
          500: '#E1306C',
          600: '#C13584',
          700: '#AD1E7A'
        },
        // Dark theme color variants
        dark: {
          bg: {
            primary: '#0a0a0a',      // Main background
            secondary: '#1a1a1a',    // Card/component background
            tertiary: '#2a2a2a',     // Elevated elements
          },
          text: {
            primary: '#f5f5f5',      // Main text (high contrast)
            secondary: '#d4d4d4',    // Secondary text
            tertiary: '#a3a3a3',     // Muted text
          },
          border: {
            primary: '#3a3a3a',      // Main borders
            secondary: '#2a2a2a',    // Subtle borders
          }
        },
        light: {
          bg: {
            primary: '#ffffff',      // Main background
            secondary: '#f9fafb',    // Card/component background
            tertiary: '#f3f4f6',     // Elevated elements
          },
          text: {
            primary: '#111827',      // Main text
            secondary: '#4b5563',    // Secondary text
            tertiary: '#6b7280',     // Muted text
          },
          border: {
            primary: '#e5e7eb',      // Main borders
            secondary: '#f3f4f6',    // Subtle borders
          }
        }
      },
      boxShadow: {
        'lg': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Smooth transition classes for theme switching
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        'theme': '300ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
