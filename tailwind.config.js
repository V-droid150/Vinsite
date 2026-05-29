/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00e5ff',
        'neon-cyan-dim': '#00b8d4',
        'dark-bg': '#050508',
        'dark-surface': '#0a0a12',
        'dark-card': '#0d0d1a',
        'dark-border': '#1a1a2e',
        'glass-white': 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
        'mono': ['"Roboto Mono"', 'monospace'],
        'rajdhani': ['"Rajdhani"', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0,229,255,0.4), 0 0 30px rgba(0,229,255,0.15)',
        'neon-sm': '0 0 6px rgba(0,229,255,0.3)',
        'neon-lg': '0 0 20px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.2)',
        'glass': '0 4px 30px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.12), transparent)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,229,255,0.2), 0 0 10px rgba(0,229,255,0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(0,229,255,0.5), 0 0 30px rgba(0,229,255,0.25)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
