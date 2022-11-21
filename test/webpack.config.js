const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');

module.exports = {
  mode: 'production',
  entry: WebpackWatchedGlobEntries.getEntries(
      [
        // Your path(s)
        path.resolve(__dirname, './src/**/*.ts'),
        path.resolve(__dirname, './src/**/*.js')
      ],
  ),
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  target: 'web',
  externals: /^(k6|https?:\/\/)(\/.*)?/,
  // Generate map files for compiled scripts
  devtool: "source-map",
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackWatchedGlobEntries(),
    // Copy assets to the destination folder
    // see `src/post-file-test.ts` for an test example using an asset
    new CopyPlugin({
      patterns: [{ 
        from: path.resolve(__dirname, 'src/config/*.json'),
        to: "config/[name][ext]",
        noErrorOnMissing: true 
      }],
    }),
  ],
  optimization: {
    // Don't minimize, as it's not used in the browser
    minimize: false,
  },
};
