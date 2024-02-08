const babel = require('@babel/core')
const schema = require('./schema.json')

module.exports = function Home(content) {
  const callback = this.async()
  const options = this.getOptions(schema)

  babel.transform(content, options, function (err, result) {
    if (err) {
      return callback(err)
    }
    callback(null, result.code)
  })
}
