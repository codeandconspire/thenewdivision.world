const html = require('choo/html')
const error = require('./error')
const Header = require('../header')
const Footer = require('../footer')
const { text } = require('../base')

const DEFAULT_TITLE = text`SITE_NAME`

module.exports = createView

function createView (view, getMeta, _opts = {}) {
  return function (state, emit) {
    let children, meta, setting
    let config = { }
    const opts = _opts

    state.prismic.getSingle('setting', function (err, doc) {
      if (err || !doc) return null
      setting = doc.data

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
            'og:image': doc.data.share.url,
            'og:image:width': doc.data.share.dimensions.width,
            'og:image:height': doc.data.share.dimensions.height
          })
        }
      } catch (err) {
        const title = text`Nothing here`
        config.theme = null
        config.color = null
        config.background = null
        err.status = state.offline ? 503 : err.status || 500
        children = error(err, state, emit)
        meta = { title: `${title} – ${DEFAULT_TITLE}` }
      }

      emit('meta', Object.assign({ title: DEFAULT_TITLE }, meta))
    })

    const style = `--color-background: ${config.background}; --color-text: ${config.color}`

    emit('scrolltop')

    return html`
      <div class="View" id="app" style="${style}">
        ${state.cache(Header, 'header').render(setting, state.href)}
        <main class="View-main">
          ${children}
        </main>
        ${state.cache(Footer, 'footer').render(setting, config)}
      </div>
    `
  }
}
