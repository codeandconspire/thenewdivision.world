var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')

var PRISMIC_ENDPOINT = 'https://thenewdivision.cdn.prismic.io/api/v2'

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require('../index'), {
    urls: urls,
    resolve: resolve,
    root: 'https://www.thenewdivision.world',
    zone: process.env.CLOUDFLARE_THENEWDIVISION_ZONE,
    email: process.env.CLOUDFLARE_CODEANDCONSPIRE_EMAIL,
    key: process.env.CLOUDFLARE_CODEANDCONSPIRE_KEY
  }, callback)
}

function resolve (route, done) {
  if (route !== '/stories/:uid') return done(null)
  Prismic.api(PRISMIC_ENDPOINT).then(function (api) {
    return api.query(
      Prismic.Predicates.at('document.type', 'story')
    ).then(function (response) {
      done(null, response.results.map((doc) => `/stories/${doc.uid}`))
    })
  }).catch(done)
}
