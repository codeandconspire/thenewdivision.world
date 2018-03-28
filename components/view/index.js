const html = require('choo/html')
const css = require('sheetify')
const error = require('./error')
const Header = require('./header')
const { i18n } = require('../base')
css('./index')

const DEFAULT_TITLE = 'The New Division'

const header = new Header()
const text = i18n(require('./lang.json'))

module.exports = createView

function createView (view, title) {
  return function (state, emit) {
    let children
    try {
      children = state.error ? error(state.error) : view(state, emit)
      let next = typeof title === 'function' ? title(state) : title
      if (!next) next = DEFAULT_TITLE
      else next = `${next} | ${DEFAULT_TITLE}`
      if (state.title !== next) emit('DOMTitleChange', next)
    } catch (err) {
      err.status = err.status || 500
      children = error(err)
      emit('DOMTitleChange', `${text(err.message)} | ${DEFAULT_TITLE}`)
    }

    return html`
      <body class="View">
        ${header.render()}
        ${children}
      </body>
    `
  }
}
