const path = require('path');
const process = require('process');
const EslintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

const getStyleLoaders = (preProcessor) => {
  return [
    'style-loader', 
    'css-loader', 
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    preProcessor
  ].filter(Boolean);
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders('sass-loader'),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders('stylus-loader'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.jsx|\.tsx|.js|.ts?$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: path.resolve(__dirname, './loaders/babel-loader'),
          },
          path.resolve(__dirname, '../loaders/clean-log.js')
        ],
      },
    ]
  },
  plugins: [
    new EslintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: ['node_modules'],
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    })
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }
}
