const html = require('choo/html')
const raw = require('choo/html/raw')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { asText, Elements } = require('prismic-richtext')
const view = require('../components/view')
const Figure = require('../components/figure')
const button = require('../components/button')

const text = i18n()

module.exports = view(caseView, meta)

function caseView (state, emit) {
  if (state.documents.error) throw state.documents.error

  let doc = state.documents.items.find((item) => item.uid === state.params.slug)
  if (!doc) {
    emit('doc:fetch', { type: 'case', uid: state.params.slug }, { fatal: true })

    // try and lookup case as linked item on homepage
    const parent = state.documents.items.find((doc) => doc.type === 'homepage')
    if (parent) {
      doc = parent.data.featured_cases.find(function (item) {
        return item.case.uid === state.params.slug
      }).case

      return html`
        <main class="View-container View-container--nudge View-container--fill">
          <h1 class="Display Display--1 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
          <div class="View-reverse View-reverse--md">
            <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
              ${doc.data.image.url ? state.cache(Figure, `${Figure.id(doc.data.image)}-${state.ui.isPartial}`).render(doc.data.image) : null}
            </div>
          </div>
        </main>
      `
    }

    return html`
      <main class="View-container View-container--nudge View-container--fill">
        <h1 class="Display Display--1 u-loading ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${text`Content is loading`}</h1>
      </main>
    `
  }

  return html`
    <main class="View-container View-container--nudge">
      <h1 class="Display Display--1 u-spaceIntro ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
      <div class="View-reverse View-reverse--md">
        <div class="u-spaceB4 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 225ms;' : ''}">
          ${doc.data.image.url ? state.cache(Figure, `${Figure.id(doc.data.image)}-${state.ui.isPartial}`).render(doc.data.image) : null}
        </div>
        <section class="View-grid u-spaceT1 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 175ms;' : ''}">
          ${doc.data.introduction.map((item, index, list) => html`
            <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length}">
              ${state.cache(Topic, [doc.id, Topic.id(item), state.ui.isPartial].join('-')).render(item)}
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
                  ${state.cache(Figure, Figure.id(item.image), { sizes: 'half' }).render(item.image)}
                </div>
              `)}
            </div>
          `
          case 'image': return html`
            <div class="u-spaceB4">
              ${state.cache(Figure, Figure.id(slice.primary.image)).render(slice.primary.image)}
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
            return html`
              <div class="View-grid">
                ${slice.items.map(function (item, index, list) {
                  if (item.video[0] && item.video[0].text) {
                    return html`
                      <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length} u-spaceB4">
                        <div class="Text Text--full">
                          <div style="position: relative; padding-bottom: calc(100% * (720 / 1280)); vertical-align: top; width: 100%; height: 0;">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                              ${raw(item.video[0].text)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                  } else {
                    return null
                  }
                })}
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
                      ${state.cache(Figure, `${doc.uid}-${Figure.id(item.image)}`, { interactive: true }).render(item.image)}
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
    this.resolve = state.documents.resolve
    this.local = state.components[id] = { expanded: false }
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
            <hr class="u-spaceB3">
            <h2 class="u-textSizeMd">${asText(props.heading).trim()}</h2>
          </div>
        ` : null}
        <div class="Text Text--wide u-spaceT1">
          ${asElement(props.body.slice(0, 1), this.resolve, serialize)}
        </div>
        <div class="Text u-spaceB6">
          <div></div>
          ${!this.local.expanded && props.body.length > 1 ? button(text`More`, { onclick: () => this.expand() }) : asElement(props.body.slice(1))}
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

function meta (state) {
  if (state.documents.loading) return { title: text`Loading` }
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
  return {
    'og:image': doc.data.image.url,
    title: asText(doc.data.title).trim(),
    description: doc.data.description[0].text
  }
}
