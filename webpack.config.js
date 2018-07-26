const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const prodConfig = require('./webpack.config.production');

const libraryName = 'beccaccino';

const reduxExternals = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
};

const common = {
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
  externals: {
    redux: reduxExternals,
  },
};

const developmentConfig = [{
  ...common,
  output: {
    path: path.join(__dirname, './dist'),
    filename: `${libraryName}.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
},
{
  ...common,
  target: "node",
  output: {
    path: path.join(__dirname, './dist'),
    filename: `${libraryName}-node.js`,
    library: libraryName,
    libraryTarget: 'commonjs2',
  },
}];

module.exports = (env) => {
  if (env && env.production) {
    return [
      {
        ...developmentConfig[0],
        ...prodConfig,
      },
      {
        ...developmentConfig[1],
        ...prodConfig,
      },
    ];
  }
  return developmentConfig;
};
