// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/maybe.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'maybe.js',
    libraryTarget: 'umd',
    library: 'maybe'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: "source-map",
  plugins: [ ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
    },

    ],
  },
};

module.exports = () => {
if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
} 
  return config;
};
