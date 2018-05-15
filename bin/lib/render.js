var document = require('./document')
var {performance} = require('perf_hooks')

module.exports = render

function render (entry) {
  return async function render (ctx, next) {
    try {
      await next()
      if (!ctx.body) {
        let app = require(entry)
        let html = app.toString(ctx.path, ctx.state)
        let cache = `s-maxage=${60 * 60 * 24 * 7}, max-age=${60 * 10}`

        if (ctx.app.env === 'development') cache = 'max-age=0'

        ctx.body = document(html, app.state, ctx.app)
        ctx.set('Cache-Control', cache)
        ctx.type = 'text/html'

        performance.clearMarks()
      }
    } catch (err) {
      ctx.throw(err.status || 404, err)
    }
  }
}
