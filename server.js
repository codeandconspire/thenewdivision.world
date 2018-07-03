if (!process.env.NOW) require('dotenv/config')

var url = require('url')
var jalla = require('jalla')
var body = require('koa-body')
var dedent = require('dedent')
var route = require('koa-route')
var compose = require('koa-compose')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')

var PRISMIC_ENDPOINT = 'https://thenewdivision.cdn.prismic.io/api/v2'

var app = jalla('index.js', {sw: 'sw.js'})

app.use(route.get('/robots.txt', function (ctx, next) {
  if (ctx.host === 'www.thenewdivision.world') return next()
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: /
  `
}))

app.use(route.post('/prismic-hook', compose([body(), async function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_THENEWDIVISION_SECRET, 403, 'Secret mismatch')
  return new Promise(function (resolve, reject) {
    purge(function (err, response) {
      if (err) return reject(err)
      resolve()
    })
  })
}])))

app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()

  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'max-age=0')
  } else {
    ctx.state.ref = null
  }

  var allowCache = process.env.NODE_ENV !== 'development'
  if (!previewCookie && allowCache && ctx.path !== '/prismic-preview') {
    ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 7}, max-age=${60 * 10}`)
  }

  return next()
})

app.use(route.get('/prismic-preview', async function (ctx) {
  var host = process.env.NOW_URL && url.parse(process.env.NOW_URL).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.NOW_URL, ctx.url))
  }

  var token = ctx.query.token
  var api = await Prismic.api(PRISMIC_ENDPOINT, {req: ctx.req})
  var href = await api.previewSession(token, resolvePreview, '/')
  var expires = process.env.NODE_ENV === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, {expires: expires, path: '/'})

  ctx.redirect(href)
}))

if (process.env.NOW && process.env.NODE_ENV === 'production') {
  purge(['/sw.js'], function (err) {
    if (err) throw err
    start()
  })
} else {
  start()
}

// resolve document preview url
// obj -> str
function resolvePreview (doc) {
  switch (doc.type) {
    case 'homepage': return '/'
    case 'about': return '/about'
    case 'case': return `/${doc.uid}`
    default: throw new Error('Preview not available')
  }
}

// start server
// () -> void
function start () {
  app.listen(process.env.PORT || 8080)
}
