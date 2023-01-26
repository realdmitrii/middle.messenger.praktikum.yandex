const path = require('path');

/**
 * Плагин упрощает создание HTML-файлов для обслуживания пакетов webpack.
 * Особенно полезен для пакетов webpack, которые включают хэш в имя файла,
 * который меняется при каждой компиляции.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web', // Целевая платформа

  entry: {
    // Точка входа
    main: path.resolve(__dirname, './src/index.ts'),
  },

  output: {
    clean: true, // Удаление предыдущей сборки
    path: path.resolve(__dirname, './dist'), // Путь файла сборки
    filename: 'script.[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'asset/resource/[name][ext]', // Путь файла с ресурсами
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      controllers: path.resolve(__dirname, 'src/controllers'),
      core: path.resolve(__dirname, 'src/core'),
      services: path.resolve(__dirname, 'src/services'),
      styles: path.resolve(__dirname, 'src/styles'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'), // Путь к шаблону
      filename: 'index.html', // Название файла на выходе
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: ['/node_modules/'],
      },

      {
        test: /\.hbs$/i,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              precompileOptions: {
                knownHelpersOnly: false,
              },
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },

      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Опции
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
