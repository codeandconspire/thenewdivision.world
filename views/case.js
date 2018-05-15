const html = require('choo/html')
const nanoraf = require('nanoraf')
const raw = require('choo/html/raw')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { asText, Elements } = require('prismic-richtext')
const view = require('../components/view')
const Words = require('../components/words')
const Figure = require('../components/figure')
const button = require('../components/button')
const { i18n } = require('../components/base')

const text = i18n()

module.exports = view(caseView, title)

function caseView (state, emit) {
  let doc = state.documents.items.find((item) => item.uid === state.params.slug)
  if (!doc) {
    emit('doc:fetch', {type: 'case', uid: state.params.slug})

    // try and lookup case as linked item on homepage
    const parent = state.documents.items.find((doc) => doc.type === 'homepage')
    if (parent) {
      doc = parent.data.featured_cases.find(function (item) {
        return item.case.uid === state.params.slug
      }).case

      return html`
        <main class="View-container View-container--nudge View-container--fill">
          <h1 class="Display Display--1 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
          <section class="View-grid u-spaceV8"></section>
          <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 300ms;' : ''}">
            ${doc.data.image.url ? state.cache(Figure, Figure.id(doc.data.image)).render(doc.data.image) : null}
          </div>
        </main>
      `
    }

    return html`
      <main class="View-container View-container--nudge View-container--fill">
        <h1 class="Display Display--1 u-loading ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${text`Content is loading`}</h1>
      </main>
    `
  }

  return html`
    <main class="View-container View-container--nudge">
      <h1 class="Display Display--1 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
      <section class="View-grid u-spaceV8 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 125ms;' : ''}">
        ${doc.data.introduction.map((item, index, list) => html`
          <div class="View-cell u-size1of${list.length > 3 ? 2 : list.length}">
            ${state.cache(Topic, [doc.id, Topic.id(item)].join('-')).render(item)}
          </div>
        `)}
      </section>
      <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 300ms;' : ''}">
        ${doc.data.image.url ? state.cache(Figure, Figure.id(doc.data.image)).render(doc.data.image) : null}
      </div>
      ${!state.ui.isPartial && doc.data.body.map((slice) => {
        switch (slice.slice_type) {
          case 'gallery': return html`
            <div class="View-grid">
              ${slice.items.map((item, index, list) => html`
                <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length} u-spaceB4">
                  ${state.cache(Figure, Figure.id(item.image)).render(item.image)}
                </div>
              `)}
            </div>
          `
          case 'text': return html`
            <div class="View-divider">
              <div class="View-grid">
                ${slice.primary.align.toLowerCase() === 'right' ? html`
                  <div class="View-cell u-md-size1of2 u-lg-size1of3"></div>
                ` : null}
                <div class="View-cell u-md-size1of2 u-lg-size2of3">
                  <div class="Text u-textSizeLg u-spaceV4">
                    ${asElement(slice.primary.body)}
                  </div>
                </div>
              </div>
            </div>
          `
          case 'heading': return html`
            <div class="View-divider">
              <div class="View-grid u-spaceV8">
                <div class="View-cell u-md-size1of2 u-lg-size1of3 u-spaceB6">
                  <div class="Text">
                    <h2 class="u-textSizeMd">${asText(slice.primary.heading).trim()}</h2>
                  </div>
                </div>
                <div class="View-cell u-md-size1of2 u-lg-size2of3">
                  <div class="View-grid">
                    ${slice.items.map((item) => html`
                      <div class="View-cell u-lg-size1of2 u-spaceB6">
                        <div class="Text u-textSizeLg">
                          ${asElement(item.body)}
                        </div>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
            </div>
          `
          case 'video': {
            let embed = slice.primary.video.find((block) => block.type === 'embed')

            if (embed) {
              embed = asElement([embed])
            } else {
              embed = slice.primary.video.find((block) => block.type === 'preformatted')
              if (!embed) return null
              embed = raw(embed.text)
            }

            return html`
              <div class="Text Text--full u-spaceB4">
                ${embed}
              </div>
            `
          }
          case 'testimonies': return html`
            <div class="View-grid">
              ${slice.items.map((props, index, list) => {
                const background = props.color.split(' ').reduce((str, part) => {
                  return str + part[0].toUpperCase() + part.substr(1)
                }, '') || 'white'

                return html`
                  <div class="View-cell u-md-size1of2 u-lg-size1of3 u-row u-aspect ${index === 2 ? 'u-lg-show' : ''} u-spaceB4">
                    <div class="u-sizeFill u-flex u-column u-theme${background} u-color u-bg">
                      <div class="u-sizeFill u-flex u-column u-spaceA4">
                        <div class="u-sizeFill">
                          ${props.logotype.url ? html`<img src="${props.logotype.url}">` : null}
                        </div>
                        <blockquote class="Display Display--4 u-spaceB6 u-spaceT8">
                          ${asElement(props.quote)}
                        </blockquote>
                        ${asElement(props.cite)}
                      </div>
                    </div>
                  </div>
                `
              })}
            </div>
          `
          case 'cases': return html`
            <div class="View-divider">
              <h2 class="u-textSizeLg u-textBold">
                ${text`More case studies`}
              </h2>
              <div class="View-grid View-grid--tight">
                ${slice.items.map((item, index, list) => html`
                  <div class="View-cell u-md-size1of2 u-spaceT3">
                    <a href="${state.documents.resolve(item.link)}" class="Link--splash u-spaceB2">
                      ${state.cache(Figure, `${doc.uid}-${Figure.id(item.image)}`, {interactive: true}).render(item.image)}
                      <h3 class="u-textBold u-spaceT1">${asText(item.link.data.title)}</h3>
                      <p>${asText(item.link.data.description)}</p>
                    </a>
                  </div>
                `)}
              </div>
            </div>
          `
          case 'words': return html`
            <div class="View-divider">
              ${state.cache(LazyWords, doc.id).render()}
            </div>
          `
          default: return null
        }
      })}
    </main>
  `
}

class LazyWords extends Words {
  constructor (id, state, emit) {
    super(`${id}-words`, state, emit)
    this.id = id
    this.local.ready = false
    this.state = state
    this.emit = emit
  }

  update () {
    if (!this.local.ready) return !!this.getHomepage()
    return false
  }

  afterupdate (el) {
    if (this.local.ready) super.load(el)
  }

  getHomepage () {
    return this.state.documents.items.find((doc) => doc.type === 'homepage')
  }

  load (el) {
    let top = offset()

    const onresize = nanoraf(function () {
      top = offset()
    })

    const onscroll = nanoraf(() => {
      if (window.scrollY + window.innerHeight >= top) {
        this.emit('doc:fetch', {type: 'homepage'})
        window.removeEventListener('scroll', onscroll)
        window.removeEventListener('resize', onresize)
      }
    })

    const unload = super.unload
    this.unload = (el) => {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
      if (unload) unload.call(this, el)
    }

    window.addEventListener('scroll', onscroll, {passive: true})
    window.addEventListener('resize', onresize, {passive: true})

    function offset () {
      let top = el.offsetTop
      let next = el
      while ((next = next.offsetParent)) {
        if (!isNaN(next.offsetTop)) top += next.offsetTop
      }
      return top
    }
  }

  createElement () {
    const doc = this.getHomepage()

    if (!doc) return html`<div></div>`

    this.local.ready = true
    return super.createElement(doc.data.words.filter((slice) => {
      return slice.primary.case.id === this.id
    }))
  }
}

class Topic extends Component {
  constructor (id, state) {
    super(id)
    this.id = id
    this.resolve = state.documents.resolve
    this.local = state.components[id] = state.components[id] || {}
  }

  static id (props) {
    return asText(props.heading)
      .trim()
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
    return html`
      <div class="Text u-textSizeSm" id="${this.id}">
        <hr class="u-spaceB2">
        <h2 class="u-textSizeMd">${asText(props.heading).trim()}</h2>
        ${asElement(props.body.slice(0, 1), this.resolve, serialize)}
        ${!this.local.expanded && props.body.length > 1 ? button(this.expand.bind(this), text`More`) : asElement(props.body.slice(1))}
      </div>
    `

    function serialize (node, content, children) {
      switch (node.type) {
        case Elements.paragraph: return html`<p class="u-spaceB2">${children}</p>`
        default: return null
      }
    }
  }
}

function title (state) {
  if (state.documents.loading) return text`Loading`
  let doc = state.documents.items.find((item) => item.uid === state.params.slug)

  if (!doc) {
    const parent = state.documents.items.find((doc) => doc.type === 'homepage')

    if (parent) {
      doc = parent.data.featured_cases.find(function (item) {
        return item.case.uid === state.params.slug
      }).case
    }

    if (!doc) {
      const err = new Error('Page not found')
      err.status = 404
      throw err
    }
  }
  return asText(doc.data.title).trim()
}
