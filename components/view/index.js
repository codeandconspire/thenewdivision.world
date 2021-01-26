const html = require('choo/html')
const error = require('./error')
const Header = require('../header')
const Footer = require('../footer')
const { text } = require('../base')

const DEFAULT_TITLE = text`SITE_NAME`

module.exports = createView

function createView (view, getMeta) {
  return function (state, emit) {
    let children, meta, setting

    state.prismic.getSingle('setting', function (err, doc) {
      if (err || !doc) return null
      setting = doc.data

      try {
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
        err.status = state.offline ? 503 : err.status || 500
        children = error(err, state, emit)
        meta = { title: `${title} – ${DEFAULT_TITLE}` }
      }

      emit('meta', Object.assign({ title: DEFAULT_TITLE }, meta))
    })

    return html`
      <div class="View" id="app">
        ${state.cache(Header, 'header').render(setting)}
        <main class="View-main">
          ${children}
        </main>
        ${state.cache(Footer, 'footer').render(setting)}
      </div>
    `
  }
}
