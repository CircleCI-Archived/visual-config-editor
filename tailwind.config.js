module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      cursor: {
        'ew-resize': 'ew-resize',
        'ns-resize': 'ns-resize'
      },
      colors: {
        'circle-gray': {
          100: '#F7F7F7',
          200: '#F1F1F1',
          300: '#E3E3E3',
          400: '#AAAAAA',
          500: '#6A6A6A',
          600: '#555555',
          700: '#2B2B2B',
          800: '#404040',
          900: '#161616',
        },
        'circle-black': '#161616',
        'circle-green': {
          'DEFAULT': '#048C43',
          'light': '#84D69B',
        },
        'circle-red': '#F24646',
        'circle-blue': {
          'DEFAULT': '#0078CA',
          'light': '#76CDFF',
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
