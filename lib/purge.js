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
    root: `https://${process.env.HOST}`,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

function resolve (route, done) {
  switch (route) {
    case '/:slug': {
      Prismic.api(PRISMIC_ENDPOINT).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'case')
        ).then(function (response) {
          done(null, response.results.map((doc) => `/${doc.uid}`))
        })
      }).catch(done)
      break
    }
    default: return done(null)
  }
}
