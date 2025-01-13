/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        su_primary_bg: "rgba(13, 13, 35, 1)",
        su_primary_black: "rgba(13, 13, 35, 0.8)",
        su_active_bg: "rgba(255, 255, 255, 0.15)",
        su_enable_bg: "rgba(255, 255, 255, 0.08)",
        su_disabled_bg: "rgba(255, 255, 255, 0.04)",
        su_card_secondary: "rgba(25, 25, 46, 1)",

        su_overlay_bg: "rgba(13, 13, 35, 0.8)",
        su_least_bg: "rgba(46, 46, 65, 1)",
        su_secondary_bg: "rgba(37, 37, 57, 1)",
        su_ternary_bg: "rgba(30, 30, 46, 1)",
        su_quaternary_bg: "rgba(60, 60, 92, 1)",
        su_quinary_bg: "rgba(61, 61, 79, 1)",
        su_blue: "#51C0FF",
        su_purple: "#9452FF",
        su_primary: "rgba(255, 255, 255, 1)",
        su_primary_light: "rgba(255, 255, 255, 0.9)",
        su_primary_lighter: "rgba(255, 255, 255, 0.65)",
        su_secondary: "rgba(182, 182, 189, 1)",
        su_ternary: "rgba(134, 134, 145, 1)",
        su_disabled: "rgba(86, 86, 101, 1)",
        su_button_disabled: "rgb(49, 49, 68)",
        su_positive: "rgba(117, 255, 193, 1)",
        su_positive_week: "rgba(117, 255, 193, 0.3)",
        su_positive_bg: "rgb(28, 49, 59)",
        su_negative: "rgba(255, 117, 133, 1)",
        su_negative_week: "rgba(255, 117, 133, 0.3)",
        su_negative_bg: "rgb(49, 28, 50)",
        su_info: "rgba(117, 225, 255, 1)",
        su_info_week: "rgba(117, 225, 255, 0.3)",
        su_info_bg: "rgb(28, 44, 68)",
        su_warning: "rgba(255, 193, 117, 1)",
        su_warning_week: "rgba(255, 193, 117, 0.3)",
        su_warning_bg: "rgb(49, 39, 47)",
        su_brand: "rgba(117, 134, 255, 1)",
        su_brand_week: "rgba(208, 204, 244, 1)",
        su_light_pink: "rgba(249, 207, 242, 1)",
        su_tea_green: "rgba(207, 240, 206, 1)",
        su_greyed_bg: "rgba(243, 243, 244, 1)",
        su_greyed: "rgba(204, 204, 208, 1)",
        su_buttermilk: "rgba(247, 242, 187, 1)",
        su_tag_buttermilk: "rgba(61, 57, 13, 1)",
        su_tag_periwinkle: "rgba(45, 42, 66, 1)",
        su_tag_pale_mauve: "rgba(79, 54, 75, 1)",
        su_tag_tea_green: "rgba(29, 64, 29, 1)",
        su_red_reject: "rgba(147, 0, 0, 1)",
        su_pink_reject: "rgba(160, 0, 96, 1)",

        su_bronze_light: "rgba(255, 231, 203, 1)",
        su_bronze_medium: "rgba(255, 200, 135, 1)",
        su_bronze_dark: "rgba(180, 86, 18, 1)",
        su_silver_light: "rgba(255, 255, 255, 0.5)",
        su_silver_medium: "rgba(255, 255, 255, 0)",
        su_silver_medium: "rgba(86, 131, 199, 1)",
        su_golden_light: "rgba(255, 236, 169, 1)",
        su_golden_medium: "rgba(255, 214, 0, 1)",
        su_golden_dark: "rgba(255, 153, 0, 1)",

      },
      backgroundImage: (theme) => ({
        "gradient-primary": `linear-gradient(to right, ${theme("colors.su_purple")}, ${theme("colors.su_blue")})`,
        "gradient-reject": `linear-gradient(to right, ${theme("colors.su_pink_reject")}, ${theme("colors.su_red_reject")})`,
      }),
      borderRadius: {
        lg: "20px",
        md: "16px",
        sm: "12px",
        xs: "8px"
      },
      fontSize: {
        '1.5xs': '11px',
        '2xs': '10px',
        '3xs': '8px',
        '4xs': '6px',
        "1.5xl": '22px',
        "2.5xl": '28px',
        "4.5xl": '42px'
      },
      width: {
        '4.5': "18px"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        '3xl': '1680px',
        '4xl': '1780px',
        '5xl': '1920px',
      },
    },
    fontFamily: {
      "Urbanist": ['Urbanist', 'sans-serif'],
      "Poppins": ['Poppins', 'sans-serif'],
    }
  },
  plugins: [require("tailwindcss-animate")],
};


// background: linear-gradient(255.29deg, #51C0FF 3.95%, #9452FF 93.55%);