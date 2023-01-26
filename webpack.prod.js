// Минификация CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Минификация JavaScript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: { chunks: 'all' },
  },
};
