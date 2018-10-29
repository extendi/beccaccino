const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
      new TerserPlugin({
        terserOptions: {
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
