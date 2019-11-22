module.exports = {
  mode: 'production',
  entry: {
    index: './src/facfactorial.js'
  },
  output: {
    filename: 'facfactorial.min.js',
    path: __dirname + '/dist',
    library: undefined,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    modules: ['./src', 'node_modules'],
    extensions: ['.json', '.js']
  }
}
