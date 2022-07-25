module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      cursor: {
        'ew-resize': 'ew-resize',
        'ns-resize': 'ns-resize',
        grab: 'grab',
      },
      borderWidth: {
        5: '5px',
        6: '6px',
      },
      borderRadius: {
        md2: '4px',
      },
      colors: {
        'circle-gray': {
          100: '#F7F7F7',
          200: '#F1F1F1',
          250: '#EDEDED', // neutral
          300: '#E3E3E3', // neutral button hover
          400: '#AAAAAA',
          500: '#6A6A6A',
          600: '#555555',
          700: '#2B2B2B',
          800: '#404040',
          900: '#161616',
        },
        'circle-black': '#161616',
        'circle-green': {
          DEFAULT: '#048C43',
          light: '#84D69B',
        },
        'circle-red': {
          DEFAULT: '#F24646',
          dangerous: '#B5261F',
          'dangerous-dark': '#960008',
        },
        'circle-blue': {
          DEFAULT: '#0078CA',
          light: '#76CDFF',
          dark: '#0062B0',
        },
        'circle-purple': {
          DEFAULT: '#8e62bd',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
