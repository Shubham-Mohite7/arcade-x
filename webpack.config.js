const path = require('path');

module.exports = {
  entry: './src/app.js',          // Your main JS file
  output: {
    path: path.resolve(__dirname, 'dist'), // Output folder
    filename: 'bundle.js',                 // Final JS bundle
  },
  mode: 'production',
};
