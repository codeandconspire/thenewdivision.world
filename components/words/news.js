const css = require('sheetify')
const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const { i18n } = require('../base')
require('../base')
css('./index')

const text = i18n(require('./lang.json'))

module.exports = class Words extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.local = state.components[id] = state.components[id] || {}
  }

  static id (props) {
    const heading = asText(props.heading).trim()
    const first = props.body[0]
    return (heading || first.text)
      .toLowerCase()
      .split(' ')
      .slice(0, 6)
      .map(word => word.replace(/[^\w]/g, ''))
      .join('-')
  }

  update () {
    return false
  }

  expand () {
    this.local.expanded = true
    this.rerender()
  }

  createElement (props) {
    const expanded = typeof window === 'undefined' || this.local.expanded
    const heading = asText(props.heading).trim()
    const first = props.body[0]

    return html`
      <article class="Words-cell js-cell" id="${this.id}">
        ${props.image.url ? html`
          <img class="Words-image" src="${props.image.url}" width="${props.image.dimensions.width}" height="${props.image.dimensions.height}">
        ` : null}
        ${heading.length ? html`
          <h3 class="Display Display--3 u-spaceB3">${heading}</h3>
        ` : null}
        ${first.text ? html`
          <div class="Text u-textSizeXs u-spaceT2">
            ${asElement([first])}
            ${expanded ? asElement(props.body.slice(1)) : null}
          </div>
        ` : null}
        ${!expanded && props.body.length > 1 ? html`
          <button class="" onclick=${() => this.expand()}>${text`More`}</button>
        ` : null}
      </article>
    `
  }
}
