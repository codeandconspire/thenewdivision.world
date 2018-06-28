var html = require('choo/html')
var error = require('./error')
var Header = require('./header')
var Footer = require('./footer')
var {i18n} = require('../base')
var Takeover = require('../takeover')

var DEFAULT_TITLE = 'The New Division'

var text = i18n(require('./lang.json'))

module.exports = createView

function createView (view, title) {
  return function (state, emit) {
    if (state.ui.isPartial) return view(state, emit)

    var children
    try {
      let next = typeof title === 'function' ? title(state) : title
      if (!next) next = DEFAULT_TITLE
      else next = `${next} | ${DEFAULT_TITLE}`
      if (state.title !== next) emit('DOMTitleChange', next)
      children = state.error ? error(state.error) : view(state, emit)
    } catch (err) {
      err.status = err.status || 500
      children = error(err)
      emit('DOMTitleChange', `${text(err.message)} | ${DEFAULT_TITLE}`)
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
