const splitRequire = require('split-require')
const lazy = require('choo-lazy-view')
const choo = require('choo')

const app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(lazy)
app.use(require('choo-service-worker')('/sw.js'))
app.use(require('choo-meta')({ origin: 'https://www.thenewdivision.world' }))
app.use(require('./stores/navigation'))
app.use(require('./stores/preload'))
app.use(require('./stores/prefetch'))
app.use(require('./stores/prismic')())
app.use(require('./stores/tracking'))

app.route('/', lazy(() => splitRequire('./views/page')))
app.route('/*', lazy(() => splitRequire('./views/page')))

try {
  module.exports = app.mount('#app')
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}
