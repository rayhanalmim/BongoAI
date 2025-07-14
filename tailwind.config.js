/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background))',
                foreground: 'rgb(var(--foreground))',
                card: 'rgb(var(--card))',
                'card-foreground': 'rgb(var(--card-foreground))',
                popover: 'rgb(var(--popover))',
                'popover-foreground': 'rgb(var(--popover-foreground))',
                primary: 'rgb(var(--primary))',
                'primary-foreground': 'rgb(var(--primary-foreground))',
                secondary: 'rgb(var(--secondary))',
                'secondary-foreground': 'rgb(var(--secondary-foreground))',
                muted: 'rgb(var(--muted))',
                'muted-foreground': 'rgb(var(--muted-foreground))',
                accent: 'rgb(var(--accent))',
                'accent-foreground': 'rgb(var(--accent-foreground))',
                destructive: 'rgb(var(--destructive))',
                'destructive-foreground': 'rgb(var(--destructive-foreground))',
                border: 'rgb(var(--border))',
                input: 'rgb(var(--input))',
                ring: 'rgb(var(--ring))',
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
                slideIn: 'slideIn 0.3s ease-out',
                'pulse-soft': 'pulse 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },
    plugins: [],
} 