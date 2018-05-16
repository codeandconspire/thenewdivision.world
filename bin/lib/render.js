var document = require('./document')
var concat = require('concat-stream')
var {performance} = require('perf_hooks')

module.exports = render

function render (entry) {
  return async function render (ctx, next) {
    try {
      await next()
      if (!ctx.body && ctx.accepts('html')) {
        let app = require(entry)
        let state = Object.assign({}, await prefetch(app, ctx.path), ctx.state)
        let html = app.toString(ctx.path, state)

        ctx.body = await new Promise(function (resolve, reject) {
          var stream = document(html, app.state, ctx.app)
          stream.pipe(concat({encoding: 'buffer'}, resolve))
        })

        let cache = `s-maxage=${60 * 60 * 24 * 7}, max-age=${60 * 10}`
        if (ctx.app.env === 'development') cache = 'max-age=0'
        ctx.set('Cache-Control', cache)
        ctx.type = 'text/html'
        if (ctx.app.env !== 'development') {
          ctx.append('Link', [
            `</${ctx.script.hash.toString('hex').slice(0, 16)}/bundle.js>; rel=preload; as=script`,
            `</${ctx.style.hash.toString('hex').slice(0, 16)}/bundle.css>; rel=preload; as=style`
          ])
        }

        performance.clearMarks()
        performance.clearMeasures()
      }
    } catch (err) {
      ctx.throw(err.status || 404, err)
    }
  }
}

async function prefetch (app, href) {
  var state = {}
  state.prefetch = []
  app.toString(href, state)
  var result = Object.assign({}, app.state)
  delete app.state.prefetch
  await Promise.all(result.prefetch)
  delete result.prefetch
  return result
}
