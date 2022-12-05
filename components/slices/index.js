const html = require('choo/html')
const raw = require('choo/html/raw')
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

  // render slice as element
  // (obj, num) -> Element
  static asSlice (slice, index, opts) {
    const { state, id, emit } = opts

    function validate (link) {
      if (!link || link.link_type === 'Any' || (link && link.isBroken)) {
        return null
      }
      return link
    }

    if (!slice) return null
    const data = slice.primary || {}
    const items = slice.items
    const logos = Clients.logos(state)
    const clients = Clients.list(state)

    const layout = function (content) {
      const id = `${slice.slice_type}-${index}`
      const classes = className('Slices-item', {
        'Slices-item--half': data.half,
        'Slices-item--space': data.space,
        'u-hiddenVisually': data.hidden
      })
      return html`<div class="${classes}" id="${id}">${content}</div>`
    }

    switch (slice.slice_type) {
      case 'space': {
        data.space = true
        return layout()
      }
      case 'intro': {
        if (!data.heading || !data.heading.length) return null
        const link = validate(data.link)
        let action

        if (link && emit) {
          emit('preload', link)
        }

        if (link) {
          action = {
            link,
            text: data.link_text ? data.link_text : text`Read more`
          }
        }

        return layout(intro({
          title: asElement(data.heading, resolve, serialize),
          intro: data.intro && data.intro.length ? asElement(data.intro, resolve, serialize) : null,
          large: true,
          action
        }))
      }
      case 'intro_case': {
        if (!data.heading || !data.heading.length) return null
        return layout(intro({
          title: asElement(data.heading, resolve, serialize),
          large: true,
          intro: data.intro && data.intro.length ? asElement(data.intro, resolve, serialize) : null,
          client: data.client && data.client.id ? logos(data.client.id, { dark: opts.light, large: true }) : null,
          label: data.label ? data.label : null,
          tags: data.tags ? data.tags : null,
          type: data.type ? data.type : null
        }))
      }
      case 'heading': {
        if (!data.heading || !data.heading.length) return null
        return layout(intro({
          sup: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
          large: data.large,
          title: data.heading ? asElement(data.heading, resolve, serialize) : null,
          pushed: data.pushed
        }))
      }
      case 'body': {
        if ((!data.text || !data.text.length) && (!data.heading || !data.heading.length)) return null
        return layout(words({
          columns: data.columns,
          pushed: data.pushed,
          header: data.heading && data.heading.length && data.heading[0].text ? asElement(data.heading, resolve, serialize) : null,
          main: asElement(data.text, resolve, serialize)
        }))
      }
      case 'photo': {
        if (!data.image || !data.image.url) return null
        const caption = data.caption && data.caption.length ? asElement(data.caption, resolve, serialize) : null
        return layout(media(figure(data.image, { half: data.half, eager: index < 3 }), { caption }))
      }
      case 'video': {
        if (!data.vimeo) return null
        const caption = data.caption && data.caption.length ? asElement(data.caption, resolve, serialize) : null
        return layout(media(raw(data.vimeo), { caption }))
      }
      case 'callout': {
        data.half = true
        if (!data.heading && !data.content) return null
        const link = validate(data.link)
        if (link && emit) {
          emit('preload', link)
        }

        return layout(callout({
          heading: data.heading ? asText(data.heading) : null,
          content: data.content ? asElement(data.content, resolve, serialize) : null,
          link: link ? resolve(link) : null,
          icon: data.icon,
          loose: data.loose
        }))
      }
      case 'logos': {
        return layout(clients({ dark: opts.light }))
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
            figure: figure(item.image, { team: true }),
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
          if (emit) {
            emit('preload', link)
          }

          return {
            title: asElement(item.heading, resolve, serialize),
            client: item.client && item.client.id ? logos(item.client.id, { dark: opts.light, small: true }) : null,
            link
          }
        }).filter(Boolean)
        if (!articles || !articles.length) return
        return layout(cases(articles, title, data.pushed))
      }
      case 'quotes': {
        if (!items && !items.length) return null
        const articles = items.map(function (item) {
          if (!item.content || !item.content.length) return null
          return {
            content: asElement(item.content, resolve, serialize),
            author: item.author && item.author.length ? asElement(item.author, resolve, serialize) : null,
            client: item.client && item.client.id ? logos(item.client.id, { dark: opts.light, large: true }) : null
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
        if (emit) {
          emit('preload', link)
        }

        const opts = {
          label: data.label && data.label.length ? asElement(data.label, resolve, serialize) : null,
          title: data.heading ? asText(data.heading, resolve, serialize) : null,
          link,
          dark: data.dark
        }
        return layout(media(figure(data.image, { half: data.half }), opts))
      }
      case 'enterence': {
        if (!data.heading || !data.heading.length) return null
        if (!data.image || !data.image.url) return null

        const link = validate(data.link)
        if (!link) return null
        if (emit) {
          emit('preload', link)
        }

        const props = {
          label: data.label ? data.label : null,
          title: data.heading ? asText(data.heading, resolve, serialize) : null,
          client: data.client && data.client.id ? logos(data.client.id, { dark: opts.light, small: data.half }) : null,
          link,
          small: data.half,
          color: data.dark_label ? 'light' : 'dark',
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
          if (emit) {
            emit('preload', link)
          }

          return {
            label: item.label ? item.label : null,
            title: asText(item.heading),
            link,
            figure: figure(item.image, { teaser: true })
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
            client: item.client && item.client.id ? logos(item.client.id, { dark: opts.light, small: true }) : null
          }
        }).filter(Boolean)

        // Forgive me, Lord, for I have sinned
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

  createElement (slices, opts = {}) {
    // Prepared for usage of choo components
    opts.state = this.state
    opts.emit = this.emit
    opts.id = this.id

    return html`
      <div class="Slices js-slices" id="${this.id}">
        ${slices
          ? slices.map(function (item, index) {
              return Slices.asSlice(item, index, opts)
            })
          : null}
      </div>
    `
  }
}
