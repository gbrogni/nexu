import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nexu: {
          graphite: 'rgb(16 24 40)',
          offwhite: 'rgb(248 250 252)',
          border: 'rgb(228 231 236)',
          muted: 'rgb(52 64 84)',
          deep: 'rgb(11 18 32)',
          blue: 'rgb(45 91 255)',
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))',
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Manrope',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Hierarquia Nexu
        'nexu-title': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        'nexu-section': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'nexu-body': ['0.875rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'nexu-label': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Sombras discretas para Nexu (evitar sombras fortes)
        nexu: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;