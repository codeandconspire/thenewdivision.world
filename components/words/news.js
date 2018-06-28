const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const Figure = require('../figure')
const { i18n } = require('../base')
const button = require('../button')

const text = i18n(require('./lang.json'))

module.exports = class Words extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.cache = state.cache
    this.local = state.components[id] = {}
  }

  static id (props) {
    const heading = asText(props.heading).trim()
    const first = props.body[0]
    return (heading || first.text)
      .toLowerCase()
      .split(' ')
      .slice(0, 6)
      .map((word) => word.replace(/[^\w]/g, ''))
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
        ${props.image.url ? this.cache(Figure, `${this.id}-${Figure.id(props.image)}`, {sizes: [[`${100 / 3}vw`, 1000], ['50vw']]}).render(props.image) : null}
        ${heading.length ? html`
          <h3 class="Display Display--3 u-spaceB3">${heading}</h3>
        ` : null}
        ${first.text ? html`
          <div class="Text u-textSizeSm u-spaceT2">
            ${asElement([first])}
            ${expanded ? asElement(props.body.slice(1)) : null}
          </div>
        ` : null}
        ${!expanded && props.body.length > 1 ? button(() => this.expand(), text`More`) : null}
      </article>
    `
  }
}
