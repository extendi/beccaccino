const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const libraryName = 'redux-http-client';

const propTypesExternals = {
  root: 'PropTypes',
  commonjs2: 'prop-types',
  commonjs: 'prop-types',
  amd: 'prop-types',
};

const reactExternals = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reactDOMExternals = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

module.exports = {
  entry: path.join(__dirname, './src/index.ts'),
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })]
  },
  module: {
      rules: [
          { test: /\.tsx?$/, loader: "ts-loader"},
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: `${libraryName}.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    react: reactExternals,
    'react-dom': reactDOMExternals,
    'prop-types': propTypesExternals,
  },
};
