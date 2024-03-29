module.exports = {
  // plugin: babel-preset-react-app
  presets: [
    // ["react-app", { "flow": false, "typescript": true }]
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3
    }], 
    '@babel/preset-react'
  ],
  plugins: ['react-hot-loader/babel', '@babel/plugin-transform-runtime'],
}
