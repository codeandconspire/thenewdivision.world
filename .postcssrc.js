module.exports = config

function config (ctx) {
  const plugins = [
    require('postcss-import')()
  ]

  if (ctx.env !== 'development') {
    plugins.push(
      require('autoprefixer')()
    )
  }

  return Object.assign({}, ctx, {
    map: ctx.env === 'development',
    plugins: plugins
  })
}
