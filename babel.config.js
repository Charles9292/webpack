module.exports = {
  // plugin: babel-preset-react-app
  presets: [
    // ["react-app", { "flow": false, "typescript": true }]
    '@babel/preset-env', '@babel/preset-react'
  ],
  plugins: ['react-hot-loader/babel'],
}
