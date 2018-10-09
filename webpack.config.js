const path = require('path');
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: 'none',
  devtool: 'source-map',
  entry: {
    'react-scroll': './src/ScrollBarOrigin',
    'react-scroll.min': './src/ScrollBarOrigin',
  },
  output: {
    filename: './[name].js',
    // library: 'ReactCustomScrollbars',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    // })
    // new ExtractTextWebpackPlugin('css/style.css')  

  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
      {
        test: /\.styl$/,
        // loader: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: ['css-loader','stylus-loader'],
        // })
        // use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          use: ['css-loader', 'stylus-loader']       
      // })
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            comparisons: false,
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
}