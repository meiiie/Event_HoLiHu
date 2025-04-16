module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'tailwindcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': false
      }
    },
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  }
};
