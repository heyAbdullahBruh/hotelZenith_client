// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Gold / Luxury Accent
        primary: {
          50: '#FFFAEB',
          100: '#FCEFC7',
          400: '#D9A404',
          500: '#B48606', // Main Brand Gold
          600: '#926A05',
          900: '#4D3601',
        },
        // Slate / Neutral / Sophisticated
        secondary: {
          50: '#F8FAFC',
          800: '#1E293B',
          900: '#0F172A', // Deep Navy/Black for footers/dark mode
        },
        // Functional
        success: '#10B981', // Emerald 500
        error: '#EF4444',   // Red 500
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'zenith': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)', // Soft, high-end float
        'glow': '0 0 15px rgba(180, 134, 6, 0.3)', // Gold glow for active states
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          '2xl': '1400px', // Wider container for large screens
        },
      },
    },
  },
};