const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
};
