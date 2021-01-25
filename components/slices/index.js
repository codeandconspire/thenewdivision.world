const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const media = require('../media')
const Figure = require('../figure')
const { className, resolve, serialize } = require('../base')

module.exports = class Slices extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
  }

  update () {
    return true
  }

  createElement (slices, opts = {}) {
    // Prepared for usage of choo components
    const { state, id } = this

    // render slice as element
    // (obj, num) -> Element
    function asSlice (slice, index) {
      if (!slice) return null

      const layout = function (content) {
        const classes = className('Slices-item', {
          'Slices-item--gray': slice.gray || (slice.primary && slice.primary.gray),
          'Slices-item--half': slice.half || (slice.primary && slice.primary.half),
          'Slices-item--center': slice.center || (slice.primary && slice.primary.center),
          'Slices-item--stacked': slice.stacked || (slice.primary && slice.primary.stacked),
          'Slices-item--hidden': slice.hidden || (slice.primary && slice.primary.hidden)
        })
        return html`
          <div class="${classes}">
            <div class="${slice.full ? '' : 'u-container'}">
              ${content}
            </div>
          </div>
        `
      }

      switch (slice.slice_type) {
        case 'body': {
          if (!slice.primary.content.length) return null
          if (slice.primary.middle) slice.primary.center = true
          const classes = className('RichText', {
            'RichText--middle': slice.center || slice.primary.middle,
            'RichText--larger': slice.larger || slice.primary.larger,
            'u-textCenter': slice.primary.middle
          })
          return layout(html`
            <div class="${classes}">
              ${asElement(slice.primary.content, resolve, serialize)}
            </div>
          `)
        }
        case 'image':
        case 'photo': {
          if (!slice.primary.image.url) return null
          const caption = slice.primary.caption ? asElement(slice.primary.caption) : null
          const figure = state.cache(Figure, `figure-${id}-${index}`).render(slice.primary.image)
          return layout(media(figure, { caption: caption }))
        }
        case 'divider': {
          slice.stacked = true
          return layout(html`<hr>`)
        }
        default: {
          if (slice.children) return layout(slice.children)
          return null
        }
      }
    }

    return html`
      <div class="Slices ${opts.stacked ? 'Slices--stacked' : ''}" id="${id}">
        ${slices ? slices.map(asSlice) : null}
      </div>
    `
  }
}
