var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var asElement = require('prismic-element')
var {asText, Elements} = require('prismic-richtext')
var view = require('../components/view')
var Figure = require('../components/figure')
var button = require('../components/button')
var {i18n} = require('../components/base')

var text = i18n()

module.exports = view(caseView, title)

function caseView (state, emit) {
  if (state.documents.error) throw state.documents.error

  var doc = state.documents.items.find((item) => item.uid === state.params.slug)

  if (!doc) {
    emit('doc:fetch', {type: 'case', uid: state.params.slug})

    // try and lookup case as linked item on homepage
    let parent = state.documents.items.find((doc) => doc.type === 'homepage')
    if (parent) {
      doc = parent.data.featured_cases.find(function (item) {
        return item.case.uid === state.params.slug
      }).case

      return html`
        <main class="View-container View-container--nudge View-container--fill">
          <h1 class="Display Display--1 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
          <div class="View-reverse View-reverse--md">
            <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 300ms;' : ''}">
              ${doc.data.image.url ? state.cache(Figure, `${Figure.id(doc.data.image)}-${state.ui.isPartial}`, {sizes: [['100vw', 3260], ['100vw', 1280]]}).render(doc.data.image) : null}
            </div>
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

  emit('meta', {
    image: doc.data.image.url,
    title: doc.data.title[0].text,
    description: doc.data.description[0].text
  })

  return html`
    <main class="View-container View-container--nudge">
      <h1 class="Display Display--1 u-spaceIntro ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
      <div class="View-reverse View-reverse--md">
        <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 300ms;' : ''}">
          ${doc.data.image.url ? state.cache(Figure, `${Figure.id(doc.data.image)}-${state.ui.isPartial}`, {sizes: [['100vw', 3260], ['100vw', 1280]]}).render(doc.data.image) : null}
        </div>
        <section class="View-grid u-spaceT4 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 125ms;' : ''}">
          ${doc.data.introduction.map((item, index, list) => html`
            <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length}">
              ${state.cache(Topic, [doc.id, Topic.id(item), state.ui.isPartial].join('-'), {size: list.length > 1 ? 'small' : 'large'}).render(item)}
            </div>
          `)}
        </section>
      </div>
      ${!state.ui.isPartial && doc.data.body.map((slice) => {
        switch (slice.slice_type) {
          case 'gallery': return html`
            <div class="View-grid">
              ${slice.items.map((item, index, list) => html`
                <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length} u-spaceB4">
                  ${state.cache(Figure, Figure.id(item.image), {sizes: [['50vw', 600]]}).render(item.image)}
                </div>
              `)}
            </div>
          `
          case 'image': return html`
            <div class="u-spaceB4">
              ${state.cache(Figure, Figure.id(slice.primary.image), {sizes: [['100vw', 3260], ['100vw', 1280]]}).render(slice.primary.image)}
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
                    <h2 class="u-textSizeLg">${asText(slice.primary.heading).trim()}</h2>
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
                var background = props.color.split(' ').reduce((str, part) => {
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
          default: return null
        }
      })}
    </main>
  `
}

class Topic extends Component {
  constructor (id, state, opts = {}) {
    super(id)
    this.id = id
    this.size = opts.size
    this.resolve = state.documents.resolve
    this.local = state.components[id] = {expanded: false}
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

  unload () {
    this.local.expanded = false
  }

  createElement (props) {
    return html`
      <div id="${this.id}">
        ${props.heading ? html`
          <div class="Text Text--full">
            <hr class="u-spaceB2">
            <h2 class="u-textSize${this.size === 'small' ? 'Md' : 'Lg'}">${asText(props.heading).trim()}</h2>
          </div>
        ` : null}
        <div class="Text Text--wide u-textSize${this.size === 'small' ? 'Sm' : 'Lg'} u-spaceT1">
          ${asElement(props.body.slice(0, 1), this.resolve, serialize)}
        </div>
        <div class="Text u-spaceB6">
          <div></div>
          ${!this.local.expanded && props.body.length > 1 ? button(this.expand.bind(this), text`More`) : asElement(props.body.slice(1))}
        </div>
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
  var doc = state.documents.items.find((item) => item.uid === state.params.slug)

  if (!doc) {
    let parent = state.documents.items.find((doc) => doc.type === 'homepage')

    if (parent) {
      doc = parent.data.featured_cases.find(function (item) {
        return item.case.uid === state.params.slug
      }).case
    }

    if (!doc) {
      let err = new Error('Page not found')
      err.status = 404
      throw err
    }
  }
  return asText(doc.data.title).trim()
}
