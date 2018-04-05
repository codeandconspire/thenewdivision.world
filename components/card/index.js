const css = require('sheetify')
const assert = require('assert')
const html = require('choo/html')
const Component = require('choo/component')
const { observe, mousemove } = require('../base')
css('./index')

const THEMES = {
  white: 'u-bgWhite',
  gray: 'u-bgGray',
  brightBlue: 'u-bgBrightBlue',
  petrol: 'u-bgPetrol',
  darkBlue: 'u-bgDarkBlue',
  sand: 'u-bgSand',
  brightSand: 'u-bgBrightSand',
  darkMagenta: 'u-bgDarkMagenta'
}

module.exports = class Card extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = state.cache
    this.emit = emit
  }

  load (el) {
    el = this.hasImage ? el.querySelector('.js-block') : el

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

    const hasImage = this.hasImage = !!props.image

    const card = html`
      <div class="${hasImage ? 'Card-block js-block' : 'Card'} ${THEMES[theme]}">
        <div class="Card-decorator">
          <svg class="Card-plus" width="20" height="20" viewBox="0 0 20 20">
            <path fill="#EFECE5" fill-rule="evenodd" d="M12.5 7.5H20v5h-7.5V20h-5v-7.5H0v-5h7.5V0h5v7.5z"/>
          </svg>
        </div>
        ${props.children}
      </div>
    `

    if (!hasImage) return card

    return html`
      <div class="Card Card--hasImage">
        <figure class="Card-figure">
          <img class="Card-image" src="${props.image.url}" alt="${props.image.alt || ''}">
          ${props.caption ? html`<figcaption class="Card-caption">${props.caption}</figcaption>` : null}
        </figure>
        ${card}
      </div>
    `
  }
}
