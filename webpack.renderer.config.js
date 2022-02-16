const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const srcPath = path.resolve(__dirname, "src");
const monacoPath = path.resolve(__dirname, "node_modules/monaco-editor/min");

module.exports = {
  stats: "errors-warnings",
  //infrastructureLogging: {level: "verbose"},
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ttf$/,
        exclude: /(node_modules)/,
        include: monacoPath,
        use: ["file-loader"],
      },
      {
        test: /\.woff2$/,
        exclude: /(node_modules)/,
        include: monacoPath,
        use: ["file-loader"],
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        include: monacoPath,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.wasm$/,
        loader: "file-loader",
        type: "javascript/auto",
      },
      {
        test: /\.json$/,
        use: ["json-loader"],
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [srcPath, "node_modules"],
    alias: {
      "@app": srcPath,
      react: path.resolve("./node_modules/react"),
      "@app.tray.png": path.resolve(__dirname, "public/tray.png"),
      "@app.png": path.resolve(__dirname, "public/app.png"),
    },
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React",
    },
  },
  devtool: "inline-source-map",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "public" }],
    }),
    new WriteFilePlugin({
      test: /public/,
      useHashIndex: true,
    }),
    new MonacoWebpackPlugin(),
  ],
};
