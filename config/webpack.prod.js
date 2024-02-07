const path = require('path')
const EslintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
  return [
    'style-loader', 
    'css-loader', 
    {
      /* -------------- 处理css兼容性问题，配合package.json中的browsersList来指定兼容性 ------------- */
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
    clean: true,
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/i,
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
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 10kb
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ts|tsx|js)$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          path.resolve(__dirname, './loaders/clean-log.js'),
          {
            loader: path.resolve(__dirname, './loaders/babel-loader'),
            options: {
              presets: ['@babel/preset-env'],
            }
          },
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     cacheDirectory: true,
          //     cacheCompression: false,
          //     presets: ['@babel/preset-env']
          //   },
          // },
        ]
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
      name: entrypoint => `runtime~${entrypoint.name}.js`
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.tsx', '.ts'],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, './loaders')],
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
  },
}
