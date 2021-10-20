module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        auto: 'auto',
        8: 'repeat(8, minmax(0, 1fr))',
      },
      backgroundImage: {
        // 'fondo-gris':
        // "linear-gradient(rgba(16, 16, 16, 0.9),rgba(16, 16, 16, 0.3)),url('./Images/fondo-gris.jpeg')",
      },
      textColor: {
        'principal-1': 'rgba(237,203,84,1)',
      },
      height: {
        'max-content': 'max-content',
        '60vh': '60vh',
        '30vh': '30vh',
        custom: '100px',
      },
      backgroundColor: {
        'gray-Primary': 'rgba(49, 47, 47, 0.84)',
        'principal-1': 'rgba(237,203,84,1)',
        'principal-1-hover': 'rgba(237, 204, 84, 0.73)',
      },
    },
  },
  variants: {
    extend: {
      padding: ['hover', 'focus'],
    },
  },
  plugins: [],
};
