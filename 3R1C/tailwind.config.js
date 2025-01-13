/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'S-Bold': ['Signifier-Bold', 'sans-serif'],
        'S-BoldItalic': ['Signifier-BoldItalic', 'sans-serif'],
        'S-ExtraLight': ['Signifier-ExtraLight', 'sans-serif'],
        'S-ExtraLightItalic': ['Signifier-ExtraLightItalic', 'sans-serif'],
        'S-Light': ['Signifier-Light', 'sans-serif'],
        'S-LightItalic': ['Signifier-LightItalic', 'sans-serif'],
        'S-Medium': ['Signifier-Medium', 'sans-serif'],
        'S-MediumItalic': ['Signifier-MediumItalic', 'sans-serif'],
        'S-Regular': ['Signifier-Regular', 'sans-serif'],
        'S-RegularItalic': ['Signifier-RegularItalic', 'sans-serif'],
        'S-Thin': ['Signifier-Thin', 'sans-serif'],
        'S-ThinItalic': ['Signifier-ThinItalic', 'sans-serif'],
      },
      colors:{
        
      }
    },
  },
  plugins: [],
}