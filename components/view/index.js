const html = require('choo/html')
const error = require('./error')
const Header = require('../header')
const Footer = require('../footer')

const SITE_NAME = 'The New Division'

module.exports = createView

function createView (view, getMeta, opts = {}) {
  return function (state, emit) {
    return state.prismic.getSingle('setting', function (err, doc) {
      const setting = doc?.data

      let children, meta
      const config = { ...opts }
      try {
        if (err) throw err

        if (typeof config.resolve === 'function') {
          Object.assign(config, config.resolve(state))
        }

        children = view(state, emit)
        meta = getMeta(state)

        if (meta && meta.title && meta?.title !== SITE_NAME) {
          meta.title = `${meta.title.replace(/\.$/, '')} – ${SITE_NAME}`
        } else if (meta) {
          meta.title = `${SITE_NAME} – ${doc?.data.fallback_title || state.text`Loading`}`
        }

        if (meta && !meta['og:image']) {
          Object.assign(meta, {
            'og:image': setting.share.url,
            'og:image:width': setting.share.dimensions.width,
            'og:image:height': setting.share.dimensions.height
          })
        }
      } catch (err) {
        const title = state.text`Nothing here`
        config.theme = null
        config.color = null
        config.background = null
        err.status = state.offline ? 503 : err.status || 500
        children = error(err, state, emit)
        meta = { title: `${title} – ${SITE_NAME}` }
      }

      emit('meta', Object.assign({ title: SITE_NAME }, meta))

      const style = `--color-background: ${config.background}; --color-text: ${config.color}`
      const languages = [doc?.lang]
        .concat(doc?.alternate_languages.map((lang) => lang.lang))
        .filter(Boolean)
        .map((lang) => lang.substring(0, 2))

      emit('scrolltop')

      return html`
        <div class="View" id="app" style="${style}">
          ${doc ? state.cache(Header, 'header').render(setting, state.href) : Header.placeholder()}
          <main class="View-main">
            ${children}
          </main>
          ${doc ? state.cache(Footer, 'footer').render(setting, languages, config) : Footer.placeholder()}
        </div>
      `
    })
  }
}
