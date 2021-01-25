module.exports = config

function config (ctx) {
  var plugins = [require('postcss-focus-visible')({ preserve: false })]
  if (ctx.env !== 'development') {
    plugins.push(require('postcss-custom-properties'))
  }

  return { plugins }
}
