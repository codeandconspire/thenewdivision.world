const choo = require('choo')

const app = choo()

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    app.use(require('choo-devtools')())
    app.use(require('choo-service-worker/clear')())
  } else {
    global.perf_hooks.performance.maxEntries = 500
  }
}

app.use(require('choo-service-worker')('/sw.js'))
app.use(require('./stores/documents'))
app.use(require('./stores/ui'))

app.route('/', require('./views/home'))
app.route('/:anchor', require('./views/home'))
app.route('/about', require('./views/about'))
app.route('/about/:anchor', require('./views/about'))
app.route('/404', require('./views/404'))

try {
  module.exports = app.mount('body')
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('has-js')
  }
}
