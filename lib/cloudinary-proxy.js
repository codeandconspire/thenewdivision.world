var https = require('https')
var cloudinary = require('cloudinary')

cloudinary.config({
  secure: true,
  cloud_name: 'dykmd8idd',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = imageproxy

function imageproxy (type, transform, uri) {
  if (type === 'fetch' && !/^(?:https?:)?\/\//.test(uri)) {
    uri = `https://thenewdivision.cdn.prismic.io/thenewdivision/${uri}`
  }

  return new Promise(function (resolve, reject) {
    var url
    if (process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET) {
      let opts = { type: type, sign_url: true }
      if (transform) opts.raw_transformation = transform
      url = cloudinary.url(uri, opts)
    } else {
      url = uri
    }

    var req = https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.end()
  })
}
