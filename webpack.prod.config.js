const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./src/app.jsx"],
  output: {
    path: path.join(__dirname, "public", "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".jsx"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        PORT: JSON.stringify(process.env.PORT),
        MONGODB_URL: JSON.stringify(process.env.MONGODB_URL),
        JWT_SECRET: JSON.stringify(process.env.JWT_SECRET),
        API_URL: JSON.stringify(process.env.API_URL)
      }
    })
  ]
};
