const path = require('path')
const os = require('os')
const EslintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

/* ---------------------------------- cpu核数 --------------------------------- */
const threads = os.cpus().length

const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader, 
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
  entry: './src/main.js', // 相对路径
  output: {
    path: path.resolve(__dirname, '../dist'), // 绝对路径
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',

    /* -------------------------- 图片字体通过type：asset处理的资源 ------------------------- */
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
    clean: true,
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
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            type: 'asset/resource',
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
      threads, // 开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename:'static/css/[name].[contenthash:10].css',
      chunkFilename:'static/css/[name].chunk.[contenthash:10].css',
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      // rel: 'prefetch',
    })
  ],
  mode: 'production',
  devtool: 'source-map', // 提示错误到行列
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        parallel: threads, // 开启多进程和设置进程数量
      }),
      new ImageMinimizerPlugin({
        minimizerOptions: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            // Svgo configuration here https://github.com/svg/svgo#configuration
            [
              'svgo',
              {
                plugins: extendDefaultPlugins([
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                  {
                    name: 'addAttributesToSVGElement',
                    params: {
                      attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                    },
                  },
                ]),
              },
            ],
          ],
        },
      }),
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.tsx', '.ts'],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, './loaders')],
  },
}
