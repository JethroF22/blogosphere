const path = require("path");
const dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["babel-polyfill", "./src/app.jsx"],
  output: {
    path: path.join(__dirname, "public", "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    publicPath: "/dist/",
    historyApiFallback: true
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".jsx"]
  },
  plugins: [new dotenv()]
};
