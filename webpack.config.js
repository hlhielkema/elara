const path = require('path');

module.exports = {
  entry: './src/elara.js',
  mode: 'production',
  output: {
    filename: 'elara.js',
    path: path.resolve(__dirname, 'dist'),
  },
};