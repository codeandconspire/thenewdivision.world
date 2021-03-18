const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const media = require('../media')
const callout = require('../callout')
const intro = require('../intro')
const cases = require('../cases')
const quotes = require('../quotes')
const Illustration = require('../illustration')
const reel = require('../reel')
const news = require('../news')
const team = require('../team')
const words = require('../words')
const thoughts = require('../thoughts')
const figure = require('../figure')
const enterence = require('../enterence')
const teasers = require('../teasers')
const Clients = require('../clients')
const { asText, className, resolve, serialize, text } = require('../base')

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

    function preload (link) {
      if (typeof window !== 'undefined') {
        if (link.type !== 'page') return null
        state.prismic.getByUID('page', link.uid, function (err, doc) {
          if (err) return null
          if (doc) return null
          return doc
        })
      }
    }

    function validate (link) {
      if (!link || link.link_type === 'Any' || (link && link.isBroken)) {
        return null
      }
      return link
    }

    // render slice as element
    // (obj, num) -> Element
    function asSlice (slice, index) {
      if (!slice) return null
      const data = slice.primary
      const items = slice.items

      const layout = function (content) {
        const classes = className('Slices-item', {
          'Slices-item--half': slice.half || (data && data.half),
          'Slices-item--space': slice.space
        })
        return html`<div class="${classes}">${content}</div>`
      }

      switch (slice.slice_type) {
        case 'space': {
          slice.space = true
          return layout()
        }
        case 'intro': {
          if (!data.heading || !data.heading.length) return null
          return layout(intro({
            title: asElement(data.heading, resolve, serialize)
          }))
        }
        case 'intro_case': {
          if (!data.heading || !data.heading.length) return null
          return layout(intro({
            title: asElement(data.heading, resolve, serialize),
            intro: data.intro && data.intro.length ? asElement(data.intro, resolve, serialize) : null,
            client: data.client && data.client.id ? Clients.logos(state)(data.client.id, { dark: opts.light }) : null,
            label: data.label ? data.label : null,
            tags: data.tags ? data.tags : null,
            type: data.type ? data.type : null
          }))
        }
        case 'heading': {
          if (!data.heading || !data.heading.length) return null
          return layout(intro({
            sup: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
            title: data.heading ? asElement(data.heading, resolve, serialize) : null
          }))
        }
        case 'body': {
          if ((!data.text || !data.text.length) && (!data.heading || !data.heading.length)) return null
          return layout(words({
            columns: data.columns,
            pushed: data.pushed,
            half: data.half,
            header: data.heading && data.heading.length ? asElement(data.heading, resolve, serialize) : null,
            main: asElement(data.text, resolve, serialize)
          }))
        }
        case 'photo': {
          if (!data.image || !data.image.url) return null
          const caption = data.caption && data.caption.length ? asElement(data.caption, resolve, serialize) : null
          return layout(media(figure(data.image), { caption: caption, half: data.half }))
        }
        case 'callout': {
          slice.half = true
          if (!data.heading && !data.content) return null
          const link = validate(data.link)
          if (link) {
            preload(link)
          }

          return layout(callout({
            heading: data.heading ? asText(data.heading) : null,
            content: data.content ? asElement(data.content, resolve, serialize) : null,
            link: link ? resolve(link) : null,
            icon: data.icon
          }))
        }
        case 'logos': {
          return layout(state.cache(Clients, `clients-${id}-${index}`).render({ dark: opts.light }))
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
        case 'team': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            if (!item.image || !item.image.url) return null
            return {
              figure: figure(item.image, { half: true }),
              title: asText(item.heading),
              position: item.position && item.position.length ? asText(item.position) : null,
              intro: item.intro && item.intro.length ? asElement(item.intro, resolve, serialize) : null
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(team(articles))
        }
        case 'cases': {
          if (!items && !items.length) return null
          const title = data.heading && data.heading.length ? asText(data.heading) : null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            const link = validate(item.link)
            if (!link) return null
            preload(link)

            return {
              title: asElement(item.heading, resolve, serialize),
              client: item.client && item.client.id ? Clients.logos(state)(item.client.id, { dark: opts.light, small: true }) : null,
              link: link
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(cases(articles, title))
        }
        case 'quotes': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.content || !item.content.length) return null
            return {
              content: asElement(item.content, resolve, serialize),
              author: item.author && item.author.length ? asElement(item.author, resolve, serialize) : null,
              client: item.client && item.client.id ? Clients.logos(state)(item.client.id, { dark: opts.light }) : null
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(quotes(articles))
        }
        case 'banner': {
          if (!data.heading || !data.heading.length) return null
          if (!data.image || !data.image.url) return null
          const link = validate(data.link)
          if (!link) return null
          preload(link)

          const opts = {
            label: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
            title: data.heading ? asText(data.heading, resolve, serialize) : null,
            link: link,
            dark: data.dark
          }
          return layout(media(figure(data.image, { half: data.half }), opts))
        }
        case 'enterence': {
          if (!data.heading || !data.heading.length) return null
          if (!data.image || !data.image.url) return null

          const link = validate(data.link)
          if (!link) return null
          preload(link)

          const props = {
            label: data.label ? data.label : null,
            title: data.heading ? asText(data.heading, resolve, serialize) : null,
            client: data.client && data.client.id ? Clients.logos(state)(data.client.id, { dark: opts.light, small: true }) : null,
            link: link,
            small: data.half,
            color: data.light_label ? 'light' : 'dark',
            figure: figure(data.image, { half: data.half })
          }
          return layout(enterence(props))
        }
        case 'teasers': {
          if (!items && !items.length) return null
          const articles = items.map(function (item) {
            if (!item.heading || !item.heading.length) return null
            if (!item.image || !item.image.url) return null

            const link = validate(item.link)
            if (!link) return null
            preload(link)

            return {
              label: item.label ? item.label : null,
              title: asText(item.heading),
              link: link,
              figure: figure(item.image, { half: data.half })
            }
          }).filter(Boolean)
          if (!articles || !articles.length) return
          return layout(teasers(articles))
        }
        case 'reel': {
          if (!items && !items.length) return null
          const opts = {
            delay: data.delay ? data.delay : null
          }
          const articles = items.map(function (item) {
            if (!item.quote || !item.quote.length) return null
            return {
              quote: asElement(item.quote, resolve, serialize),
              author: item.author && item.author.length ? asText(item.author) : null,
              desc: item.desc && item.desc.length ? asText(item.desc) : null,
              client: item.client && item.client.id ? Clients.logos(state)(item.client.id, { dark: opts.light, small: true }) : null
            }
          }).filter(Boolean)

          // Forgive me lord, but I have sinned
          // When this is used as page intro on the cases page, we need a h1
          if (state.params.wildcard === 'cases') {
            opts.title = text`Cases`
          }

          if (!articles || !articles.length) return
          return layout(reel(articles, opts))
        }

        case 'illustration': {
          return layout(state.cache(Illustration, `illustration-${id}-${index}`).render(data.version))
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
