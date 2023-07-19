const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, "dist"),
      watch: true,
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/js"),
  },
};
