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
        'white':{
          'almond':'#fdfdfb',
          DEFAULT:'#ffffff',
          'dark':'#f7f6f4'
        },
        'sand':{
          
          DEFAULT:'#fdfdfb',
          'dark':'#eeebe6',
          'darker':'#dfd5cb',
          'deep':'#776E65'
        },
        'oat':{
          DEFAULT:'#e6e1db',
          'dark':'#e8d9d6',
          'darker':'#d8c6b8',
          'light':'#ECEBDE',
        },
        'beige':{
          DEFAULT:'#d1bfb1',
          'dark':'#cdb199',
          'darker':'#a5998d'
        },
        'grey':{
          DEFAULT:'#f2f2f2',
          'dark':'#efefef',
          'darker':'#dadedf'
        },
        'brick':{
          DEFAULT:'#b17457',
          'light':'#DD8560',
        },
        'green':{
          DEFAULT:'#A4B8A1',
          'light':'#C7D6C3',
          'dark':'#A4B8A1',
          'darker':'#7F9C7E'
        }

      }
    },
  },
  plugins: [],
}