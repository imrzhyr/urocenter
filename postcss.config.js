export default {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'autoprefixer': {},
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  },
  from: './src/styles'
}
