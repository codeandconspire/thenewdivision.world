const css = require('sheetify')
const assert = require('assert')
const html = require('choo/html')
const Component = require('choo/component')
const { observe, mousemove } = require('../base')
css('./index')

const THEMES = {
  white: 'u-themeWhite',
  gray: 'u-themeGray',
  brightBlue: 'u-themeBrightBlue',
  petrol: 'u-themePetrol',
  darkBlue: 'u-themeDarkBlue',
  sand: 'u-themeSand',
  brightSand: 'u-themeBrightSand',
  darkMagenta: 'u-themeDarkMagenta'
}

module.exports = class Card extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = state.cache
    this.emit = emit
  }

  load (el) {
    el = this.banner ? el.querySelector('.js-block') : el

    const stopMouseMove = mousemove(el)
    const stopObserving = observe(el, function () {
      stopObserving()
    })
    this.unload = function () {
      stopMouseMove()
      stopObserving()
    }
  }

  update () {
    return false
  }

  createElement (props) {
    assert(props.children, 'card: children should be defined')

    const theme = props.color || 'white'
    assert(typeof theme === 'string', 'card: color should be a string')

    const banner = this.banner = !!props.image

    const card = html`
      <div class="${banner ? 'Card-block js-block' : 'Card'} ${THEMES[theme]} u-bg u-color">
        <div class="Card-decorator">
          <div class="Card-plus"><div class="Card-circle"></div></div>
        </div>
        ${props.children}
      </div>
    `

    if (!banner) return card

    return html`
      <div class="Card Card--banner">
        <figure class="Card-figure">
          <img class="Card-image" src="${props.image.url}" alt="${props.image.alt || ''}">
          ${props.caption ? html`<figcaption class="Card-caption u-textSizeXs u-spaceTxs u-md-show">${props.caption}</figcaption>` : null}
        </figure>
        ${card}
      </div>
    `
  }
}
