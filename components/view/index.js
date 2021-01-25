const html = require('choo/html')
const error = require('./error')
const Footer = require('../footer')
const { text } = require('../base')

const DEFAULT_TITLE = text`SITE_NAME`

module.exports = createView

function createView (view, getMeta, _opts = {}) {
  return function (state, emit) {
    const opts = _opts
    let config, children, meta
    try {
      config = { ...opts }
      if (typeof config.resolve === 'function') {
        Object.assign(config, config.resolve(state))
      }

      children = view(state, emit)
      meta = getMeta(state)

      if (meta && meta.title && meta.title !== DEFAULT_TITLE) {
        meta.title = `${meta.title.replace(/\.$/, '')} – ${DEFAULT_TITLE}`
      }

      if (meta && !meta['og:image']) {
        Object.assign(meta, {
          'og:image': '/share.jpg',
          'og:image:width': 2160,
          'og:image:height': 1606
        })
      }
    } catch (err) {
      config.theme = 'black'
      const title = err.status === 404 ? text`Page not found` : text`Oh no`
      err.status = state.offline ? 503 : err.status || 500
      children = error(err, state, emit)
      meta = { title: `${title} – ${DEFAULT_TITLE}` }
    }

    emit('meta', Object.assign({ title: DEFAULT_TITLE }, meta))
    emit('theme', config.theme)

    return html`
      <div class="View" id="app">
        <main class="View-main">
          ${children}
        </main>
        ${config.internal ? null : state.cache(Footer, 'footer').render()}
      </div>
    `
  }
}
