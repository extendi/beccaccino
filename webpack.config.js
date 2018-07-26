const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const libraryName = 'beccaccino';

const reduxExternals = {
  root: 'redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
};

module.exports = [{
  entry: path.join(__dirname, './src/index.ts'),
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: `${libraryName}.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  externals: {
    redux: reduxExternals,
  },
},
{
  entry: path.join(__dirname, './src/index.ts'),
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  target: "node",
  output: {
    path: path.join(__dirname, './dist'),
    filename: `${libraryName}-node.js`,
    library: libraryName,
    libraryTarget: 'commonjs2',
  },
  externals: {
    redux: reduxExternals,
  },
}];
