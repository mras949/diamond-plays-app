/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: '#3b82f6', // Blue-500 (Shadcn primary)
        background: '#ffffff', // Zinc-100
        surface: '#ffffff', // White for cards
        text: '#18181b', // Zinc-900
        secondary: '#71717a', // Zinc-500
        error: '#ef4444', // Red-500
        accent: '#10b981', // Emerald-500

        // Extended color palette
        outline: '#e5e5e5', // Light gray for borders
        muted: '#f4f4f5', // Zinc-100 for muted backgrounds
        destructive: '#ef4444', // Red-500 for destructive actions

        // Additional theme colors from theme.ts
        'on-surface': '#1c1b1f', // theme.colors.onSurface
        'on-surface-variant': '#49454f', // theme.colors.onSurfaceVariant
        'surface-variant': '#f8f9fa', // Light surface variant
        'on-surface-disabled': '#9ca3af', // Disabled text color
        'validation-error': '#f97316', // Orange for validation errors
        'success': '#10b981', // Success green
        'selected': '#e0f2fe', // Light blue for selected items
        'error-bg': '#fff3f3', // Light red background
        'error-border': '#f5c6cb', // Error border
        'error-text': '#721c24', // Dark red text
      },
      fontFamily: {
        sans: ['DMSans-Regular'],
        medium: ['DMSans-Medium'],
        bold: ['DMSans-Bold'],
      },
      fontSize: {
        // Typography scale
        'body-lg': ['14px', { fontWeight: '400', lineHeight: '20px' }],
        'body-md': ['12px', { fontWeight: '400', lineHeight: '16px' }],
        'body-sm': ['10px', { fontWeight: '400', lineHeight: '14px' }],
        'label-lg': ['12px', { fontWeight: '500', lineHeight: '16px' }],
        'label-md': ['14px', { fontWeight: '500', lineHeight: '20px' }],
        'label-sm': ['8px', { fontWeight: '500', lineHeight: '12px' }],
        'headline-lg': ['30px', { fontWeight: '700', lineHeight: '36px' }],
        'headline-md': ['22px', { fontWeight: '700', lineHeight: '28px' }],
        'headline-sm': ['18px', { fontWeight: '700', lineHeight: '24px' }],

        // Additional sizes from theme
        'xs': ['8px', { lineHeight: '12px' }],
        'sm': ['10px', { lineHeight: '14px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['20px', { lineHeight: '28px' }],
        'xl': ['24px', { lineHeight: '32px' }],
        '2xl': ['28px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '36px' }],
      },
      spacing: {
        // Spacing scale
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',

        // Additional spacing from theme
        '4': '4px',
        '6': '6px',
        '10': '10px',
        '12': '12px',
        '14': '14px',
        '18': '18px',
        '20': '20px',
        '22': '22px',
        '28': '28px',
        '30': '30px',
        '36': '36px',
        '40': '40px',
        '50': '50px',
        '250': '250px',
        '350': '350px',
      },
      borderRadius: {
        // Border radius scale
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        // Shadow scale
        'sm': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        'md': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        },
        'lg': {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        },
      },
      height: {
        '48': '48px',
        '250': '250px',
        '350': '350px',
      },
      minHeight: {
        '36': '36px',
        '48': '48px',
      },
      width: {
        '20': '20px',
        '30': '30px',
        '40': '40px',
        '50': '50px',
      },
      letterSpacing: {
        'tight': '-0.5px',
        'normal': '-0.2px',
      },
      lineHeight: {
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '28': '28px',
        '30': '30px',
        '32': '32px',
        '36': '36px',
      },
    },
  },
  plugins: [],
}