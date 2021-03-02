const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const media = require('../media')
const callout = require('../callout')
const intro = require('../intro')
const Cases = require('../cases')
const news = require('../news')
const thoughts = require('../thoughts')
const Figure = require('../figure')
const Enterence = require('../enterence')
const Teasers = require('../teasers')
const Clients = require('../clients')
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
      const items = slice.items

      const layout = function (content) {
        const classes = className('Slices-item', {
          'Slices-item--half': slice.half || (data && data.half)
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
        case 'heading': {
          if (!data.heading || !data.heading.length) return null
          return layout(intro({
            label: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
            title: data.heading ? asElement(data.heading, resolve, serialize) : null
          }))
        }
        case 'body': {
          if ((!data.text || !data.text.length) && (!data.heading || !data.heading.length)) return null
          const classes = className('RichText', {
            'RichText--columns': data.columns,
            'RichText--pushed': data.pushed
          })
          return layout(html`
            <div class="${classes}">
              ${data.heading && data.heading.length ? html`
                <div>
                  ${asElement(data.heading, resolve, serialize)}
                </div>
              ` : null}
              ${asElement(data.text, resolve, serialize)}
            </div>
          `)
        }
        case 'photo': {
          if (!data.image || !data.image.url) return null
          const caption = data.caption ? asElement(data.caption, resolve, serialize) : null
          const figure = state.cache(Figure, `figure-${id}-${index}`).render(data.image)
          return layout(media(figure, { caption: caption }))
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
        case 'logos': {
          return layout(state.cache(Clients, `clients-${id}-${index}`).render())
        }
        case 'news': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            return {
              date: item.date ? item.date : null,
              title: asElement(item.heading, resolve, serialize)
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(news(articles))
        }
        case 'thoughts': {
          if (!items && !items.length) return null
          const title = data.heading ? asText(data.heading) : null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            return { title: asElement(item.heading, resolve, serialize) }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(thoughts(articles, title))
        }
        case 'cases': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            return {
              title: asElement(item.heading, resolve, serialize),
              client: item.client && item.client.id ? item.client.id : null
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(state.cache(Cases, `cases-${id}-${index}`).render(articles))
        }
        case 'banner': {
          if (!data.heading || !data.heading.length) return null
          if (!data.image || !data.image.url) return null
          const opts = {
            label: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
            title: data.heading ? asText(data.heading, resolve, serialize) : null
          }
          const figure = state.cache(Figure, `figure-${id}-${index}`).render(data.image)
          return layout(media(figure, opts))
        }
        case 'enterence': {
          if (!data.heading || !data.heading.length) return null
          if (!data.image || !data.image.url) return null
          const figure = state.cache(Figure, `figure-${id}-${index}`).render(data.image)

          let link = data.link
          if (!link || link.link_type === 'Any' || (link && link.isBroken)) {
            link = null
          }
          if (!link) return null

          const opts = {
            label: data.label ? data.label : null,
            title: data.heading ? asText(data.heading, resolve, serialize) : null,
            client: data.client && data.client.id ? data.client.id : null,
            link: link,
            figure: figure
          }
          return layout(state.cache(Enterence, `enterence-${id}-${index}`).render(opts))
        }
        case 'teasers': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            if (!item.image || !item.image.url) return null

            let link = item.link
            if (!link || link.link_type === 'Any' || (link && link.isBroken)) {
              link = null
            }
            if (!link) return null
            const figure = state.cache(Figure, `figure-${id}-${index}`).render(item.image)
            return {
              label: item.label ? item.label : null,
              title: asText(item.heading),
              link: link,
              figure: figure
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(state.cache(Teasers, `teasers-${id}-${index}`).render(articles))
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
      <div class="Slices" id="${id}">
        ${slices ? slices.map(asSlice) : null}
      </div>
    `
  }
}
