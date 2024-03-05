module.exports = {
  extends: ["react-app"],
  env: {
    node : true,
    browser: true, // 允许使用浏览器全局变量
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    babelOptions: {
      presets: [
        /* -------------------------------- 解决页面报错问题 -------------------------------- */
        ['babel-preset-react-app', false],
        'babel-preset-react-app/prod',
      ]
    }
  },
  rules: {
    "no-var": 2,
  }
}