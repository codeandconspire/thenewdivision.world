var Koa = require('koa')
var path = require('path')
var crypto = require('crypto')
var {get} = require('koa-route')
var serve = require('koa-static')
var style = require('./lib/style')
var script = require('./lib/script')
var render = require('./lib/render')

module.exports = start

function start (entry, opts = {}) {
  var dir = path.dirname(entry)
  var app = new Koa()
  app.entry = entry
  app.silent = true

  app.on('bundle:script', function (file, buf) {
    if (file !== entry) return
    app.context.script = {
      buffer: buf,
      hash: crypto.createHash('sha512').update(buf).digest('buffer')
    }
  })
  app.on('bundle:style', function (file, buf) {
    app.context.style = {
      buffer: buf,
      hash: crypto.createHash('sha512').update(buf).digest('buffer')
    }
  })

  app.use(async function (ctx, next) {
    var start = Date.now()
    await next()
    app.emit('timing', Date.now() - start, ctx)
  })

  app.use(require('koa-conditional-get')())
  app.use(require('koa-etag')())

  app.use(get(/^\/\w+\/bundle\.js(\.map)?$/, script(entry, app)))
  app.use(get(/^\/(sw|service-worker)\.js(\.map)?$/, script(path.resolve(dir, 'sw.js'), app)))
  app.use(get(/^\/\w+\/bundle\.css(\.map)?$/, style(opts.css, app)))

  if (app.env === 'development') app.use(serve(dir, {maxage: 0}))
  app.use(serve(path.resolve(dir, 'assets'), {maxage: 1000 * 60 * 60 * 24 * 365}))

  app.use(render(entry))

  return app
}
