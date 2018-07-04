var html = require('choo/html')
var error = require('./error')
var Header = require('./header')
var Footer = require('./footer')
var {i18n} = require('../base')
var Takeover = require('../takeover')

var DEFAULT_TITLE = 'The New Division'

var text = i18n(require('./lang.json'))

module.exports = createView

function createView (view, meta) {
  return function (state, emit) {
    if (state.ui.isPartial) return view(state, emit)

    var children
    try {
      children = state.error ? error(state.error) : view(state, emit)
      let next = meta(state)
      if (next.title !== DEFAULT_TITLE) {
        next.title = `${next.title} | ${DEFAULT_TITLE}`
      }
      emit('meta', next)
    } catch (err) {
      err.status = err.status || 500
      children = error(err)
      emit('meta', {
        description: '',
        'og:image': '/share.png',
        title: `${text`Oops`} | ${DEFAULT_TITLE}`
      })
    }

    return html`
      <body class="View">
        ${state.cache(Header, 'header').render(state.route)}
        ${children}
        ${state.cache(Footer, 'footer').render(state.ui.theme)}
        ${state.cache(Takeover, Takeover.id()).render()}
      </body>
    `
  }
}
