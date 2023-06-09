const splitRequire = require('split-require')
const Choo = require('choo')

const languages = require('./lib/i18n.json')

const SELECTOR = '#app'
const ALTERNATE_LANGUAGES = Object.keys(languages)
  .filter((lang) => lang !== 'en')

class App extends Choo {
  _setCache (state) {
    super._setCache(state)
    const render = state.cache
    state.cache = function (Component, id, ...args) {
      // Markup id with current language to prevent stale content
      return render(Component, `${id}-${state.language}`, ...args)
    }
  }
}

const app = new App()

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
app.use(require('./stores/i18n'))

app.route('/', lazy(() => splitRequire('./views/page')))
app.route('/*', lazy(() => splitRequire('./views/page')))
for (const lang of ALTERNATE_LANGUAGES) {
  app.route(`/${lang}`, lazy(() => splitRequire('./views/page')))
  app.route(`/${lang}/*`, lazy(() => splitRequire('./views/page')))
}

try {
  module.exports = app.mount(SELECTOR)
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}

/**
 * This is a subset of cho-lazy-view due to incompatabilities with node 16
 * @param {Function} load Asynchronous view loading function
 * @returns {Function}
 */
function lazy (load) {
  let promise
  let view

  return function proxy (state, emit) {
    if (view) return view(state, emit)

    if (!promise) {
      promise = load().then(function (_view) {
        // asynchronously render view to account for nested prefetches
        if (typeof window === 'undefined') _view(state, emit)
        else emit('render')
        view = _view
      })
      emit('prefetch', promise)
    } else {
      promise.then(function () {
        emit('render')
      })
    }

    // assuming app has been provided initialState by server side render
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-new-wrappers
      const str = new String()
      str.__encoded = true
      return str
    }
    return document.querySelector(SELECTOR)
  }
}
