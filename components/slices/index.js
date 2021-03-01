const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const media = require('../media')
const callout = require('../callout')
const heading = require('../heading')
const Figure = require('../figure')
const { asText, className, resolve, serialize } = require('../base')

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
      const data = slice.primary

      const layout = function (content) {
        const classes = className('Slices-item', {
          'Slices-item--gray': slice.gray || (data && data.gray),
          'Slices-item--half': slice.half || (data && data.half),
          'Slices-item--center': slice.center || (data && data.center),
          'Slices-item--stacked': slice.stacked || (data && data.stacked),
          'Slices-item--hidden': slice.hidden || (data && data.hidden)
        })
        return html`
          <div class="${classes}">
            <div class="${slice.full ? '' : 'u-container'}">
              ${content}
            </div>
          </div>
        `
      }
      console.log('SLICE:', slice)
      switch (slice.slice_type) {
        case 'heading': {
          if (!data.heading || !data.heading.length) return null
          return layout(heading({
            label: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
            text: data.heading ? asElement(data.heading, resolve, serialize) : null
          }))
        }
        case 'body': {
          if (!data.content.length) return null
          if (data.middle) data.center = true
          const classes = className('RichText', {
            'RichText--middle': slice.center || data.middle,
            'RichText--larger': slice.larger || data.larger,
            'u-textCenter': data.middle
          })
          return layout(html`
            <div class="${classes}">
              ${asElement(data.content, resolve, serialize)}
            </div>
          `)
        }
        case 'image':
        case 'photo': {
          if (!data.image.url) return null
          const caption = data.caption ? asElement(data.caption) : null
          const figure = state.cache(Figure, `figure-${id}-${index}`).render(data.image)
          return layout(media(figure, { caption: caption }))
        }
        case 'divider': {
          slice.stacked = true
          return layout(html`<hr>`)
        }
        case 'callout': {
          if (!data.heading && !data.content) return null
          return layout(callout({
            heading: data.heading ? asText(data.heading) : null,
            content: data.content ? asElement(data.content, resolve, serialize) : null,
            link: data.link ? resolve(data.link) : null,
            icon: data.icon
          }))
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
