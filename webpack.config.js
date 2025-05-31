const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.tsx',
    serviceWorker: './src/serviceWorker.ts'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
    static: {
      directory: path.join(__dirname, 'public')
    }
  }
}; 