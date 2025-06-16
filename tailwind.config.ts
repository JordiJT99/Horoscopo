
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Reverted to Alegreya as per PRD and previous theme
        body: ['Alegreya', 'sans-serif'], 
        headline: ['Alegreya', 'serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // These specific theme vars can remain if globals.css defines them
        'top-bar-background': 'hsl(var(--top-bar-background))',
        'top-bar-foreground': 'hsl(var(--top-bar-foreground))',
        'bottom-nav-background': 'hsl(var(--bottom-nav-background))',
        'bottom-nav-foreground': 'hsl(var(--bottom-nav-foreground))',
        'bottom-nav-active-foreground': 'hsl(var(--bottom-nav-active-foreground))',
        'sign-selector-active-border': 'hsl(var(--sign-selector-active-border))',
        'feature-card-background': 'hsl(var(--feature-card-background))',
        'feature-card-foreground': 'hsl(var(--feature-card-foreground))',
        'horoscope-summary-title': 'hsl(var(--horoscope-summary-title))',
        'horoscope-category-text': 'hsl(var(--horoscope-category-text))',
        'horoscope-progress-background': 'hsl(var(--horoscope-progress-background))',
        'horoscope-progress-indicator': 'hsl(var(--horoscope-progress-indicator))',
      },
      borderRadius: {
        lg: 'var(--radius)', // Default is 0.5rem
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Removed '3xl'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        // Removed pulseHeart keyframe
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Removed pulseHeart animation utility
      },
      // Removed backgroundImage radial-purple-gradient
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
