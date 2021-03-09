const https = require('https')
const { get } = require('koa-route')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  secure: true,
  cloud_name: 'dykmd8idd',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

//                          cloud name ↓          type ↓ file ↓
const TYPE_REG = /res\.cloudinary\.com\/(?:\w+)\/image\/(\w+)\/(.+)$/

module.exports = get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri, next) {
  console.log(type, transform, uri)
  if (ctx.querystring) uri += `?${ctx.querystring}`
  const match = uri.match(TYPE_REG)
  if (match) {
    type = match[1]
    uri = match[2]
  }

  try {
    const stream = await imageproxy(type, transform, uri)
    const headers = ['etag', 'last-modified', 'content-length', 'content-type']
    headers.forEach((header) => ctx.set(header, stream.headers[header]))
    ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
    ctx.body = stream
  } catch (err) {
    ctx.logs.error.print('media:error', err)
    ctx.status = err.status || 500
    ctx.body = ''
  }
})

function imageproxy (type, transform, uri) {
  return new Promise(function (resolve, reject) {
    const opts = { type: type, sign_url: true }
    const url = cloudinary.url(uri, opts)
    if (transform) opts.raw_transformation = transform

    const req = https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        const err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.end()
  })
}