if (!process.env.HEROKU) require('dotenv/config')

var url = require('url')
var jalla = require('jalla')
var body = require('koa-body')
var dedent = require('dedent')
var { get, post } = require('koa-route')
var compose = require('koa-compose')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
var imageproxy = require('./lib/cloudinary-proxy')

var PRISMIC_ENDPOINT = 'https://thenewdivision.cdn.prismic.io/api/v2'

var app = jalla('index.js', {sw: 'sw.js'})

app.use(function (ctx, next) {
  switch (ctx.path) {
    case '/the-global-goals-design': return ctx.redirect('/the-global-goals')
    default: return next()
  }
})

app.use(get('/robots.txt', function (ctx, next) {
  if (ctx.host === process.env.npm_package_now_alias) return next()
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: /
  `
}))

// proxy cloudinary on-demand-transform API
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

app.use(post('/prismic-hook', compose([body(), async function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
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

app.use(get('/prismic-preview', async function (ctx) {
  var host = process.env.SOURCE_VERSION && url.parse(process.env.SOURCE_VERSION).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.SOURCE_VERSION, ctx.url))
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

if (process.env.HEROKU && process.env.NODE_ENV === 'production') {
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
