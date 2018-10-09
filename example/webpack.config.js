const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, 'app.js'),
    output: {
        path: path.resolve(__dirname, '__build__'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/__build__/'
    },
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
              test: /\.css$/,
              // loader: ExtractTextPlugin.extract({
              //   fallback: 'style-loader',
              //   use: ['css-loader','stylus-loader'],
              // })
              use: ExtractTextWebpackPlugin.extract({
                // 将css用link的方式引入就不再需要style-loader了
                use: ['css-loader']       
            })
            }
          ]
    },
    resolve: {
        alias: {
          'react-scroll': path.join(__dirname, '../src'),
        }
      },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('shared'),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new ExtractTextWebpackPlugin('css/style.css') 
      ]
}