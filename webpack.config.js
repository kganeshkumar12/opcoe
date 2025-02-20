const path = require('path');

module.exports = {
  entry: './docs_custom_theme/assets/react/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './docs_custom_theme/assets/javascripts'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash].[ext]',
        },
      },
    ],
  },
  mode: 'development',
  watch: true,
};
