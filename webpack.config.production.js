const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  devtool: false,
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            pure_getters: true,
            drop_console: true,
            unsafe_comps: true,
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
