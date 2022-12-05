if (!+process.env.HEROKU) require('dotenv/config')

const jalla = require('jalla')
const body = require('koa-body')
const dedent = require('dedent')
const { get, post } = require('koa-route')
const compose = require('koa-compose')
const Prismic = require('prismic-javascript')
const purge = require('./lib/purge')
const imageproxy = require('./lib/media')

const PRISMIC_ENDPOINT = 'https://thenewdivision.cdn.prismic.io/api/v2'
const REDIRECTS = [
  ['/about', 'company'],
  ['/thekidsshow', 'global-goals-kids-show'],
  ['/varldens-plan', 'global-goals-kids-show'],
  ['/undp', 'film-for-equality'],
  ['/sei', 'interconnected-agenda'],
  ['/icc', '/'],
  ['/ghg-calculation', 'offer'],
  ['/sustainordic', 'the-nordic-report'],
  ['/boverket', 'branding-for-natures-living-infrastructure'],
  ['/climate_action', '/'],
  ['/hallbarhetsfokus-2019', 'sustainability-focus-2019'],
  ['/communicating-the-goals', 'communicating-the-global-goals']
]

const app = jalla('index.js', {
  sw: 'sw.js',
  serve: process.env.NODE_ENV === 'production'
})

app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${process.env.NODE_ENV === 'production' ? '' : '/'}
  `
}))

REDIRECTS.map((path) => app.use(get(path[0], async (ctx) => ctx.redirect(path[1]))))

app.use(imageproxy)

app.use(post('/prismic-hook', compose([body(), async function (ctx) {
  const secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  await new Promise(function (resolve, reject) {
    purge(function (err, response) {
      if (err) return reject(err)
      resolve()
    })
  })
  ctx.type = 'application/json'
  ctx.body = JSON.stringify({ success: true })
}])))

app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()

  const previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'max-age=0')
  } else {
    ctx.state.ref = null
  }

  const allowCache = process.env.NODE_ENV !== 'development'
  if (!previewCookie && allowCache && ctx.path !== '/prismic-preview') {
    ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 7}, max-age=${60 * 10}`)
  }

  return next()
})

app.use(get('/prismic-preview', async function (ctx) {
  const { token, documentId } = ctx.query
  const api = await Prismic.api(PRISMIC_ENDPOINT)
  const href = await api.getPreviewResolver(token, documentId).resolve(resolvePreview, '/')
  const expires = process.env.NODE_ENV === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * (24 - new Date().getHours())))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, {
    expires,
    httpOnly: false,
    path: '/'
  })
  ctx.redirect(href)
}))

if (+process.env.HEROKU && process.env.NODE_ENV === 'production') {
  purge(['/sw.js'], function (err) {
    // if (err) throw err
    if (err) console.log(err)
    start()
  })
} else {
  start()
}

// resolve document preview url
// obj -> str
function resolvePreview (doc) {
  switch (doc.type) {
    case 'page': return `/${doc.uid}`
    default: throw new Error('Preview not available')
  }
}

// start server
// () -> void
function start () {
  app.listen(process.env.PORT || 8080)
}
