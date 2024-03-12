const path = require('path');
const os = require('os')
const EslintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* ---------------------------------- cpu核数 --------------------------------- */
const threads = os.cpus().length

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
  entry: ['react-hot-loader/patch', './src/main.js'],
  output: {
    // 开发模式没有输出
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
  },
  module: {
    rules: [
      {
        oneOf: [
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
            test: /\.(woff2?|eot|ttf|otf|map3|map4|avi)(\?.*)?$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/fonts/[hash:10][ext][query]'
            }
          },
          {
            test: /\.(ts|tsx|js)$/,
            include: path.resolve(__dirname, '../src'),
            use: [
              {
                loader: 'thread-loader',
                options: {
                  works: threads,
                }
              },
              {
                loader: 'babel-loader',
              },
              path.resolve(__dirname, './loaders/clean-log.js'),
            ]
          },
        ]
      }
    ]
  },
  plugins: [
    new EslintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: ['node_modules'],
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
      threads,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    }),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map', // 提示错误到行
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
    alias: {
      'react-dom': '@hot-loader/react-dom',
    }
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
