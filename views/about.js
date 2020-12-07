const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const nanoraf = require('nanoraf')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const intro = require('../components/intro')
const { i18n } = require('../components/base')
const Figure = require('../components/figure')
const button = require('../components/button')

const text = i18n()

module.exports = view(about, meta)

function about (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'sand' && !state.ui.isPartial) {
    emit('ui:theme', 'sand')
  }

  const doc = state.documents.items.find((doc) => doc.type === 'about')
  if (!doc && !state.ui.isPartial) {
    emit('doc:fetch', { type: 'about' })
    return html`<main class="View-container View-container--fill"></main>`
  }

  const first = html`
  <div>
    <div class="${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
      ${intro(asText(doc.data.summary))}
    </div>
    <div class="${state.ui.isPartial ? 'u-slideIn u-spaceV8' : 'u-spaceV8'}" style="${state.ui.isPartial ? 'animation-delay: 250ms;' : ''}">
      <div class="View-grid View-grid--reverse u-spaceV8">
        <div class="View-cell u-lg-size1of3">
          <div class="Text u-textSizeLg u-spaceB2">
            ${asElement(doc.data.we_introduction_aside)}
          </div>
        </div>
        <div class="View-cell u-lg-size2of3">
          <div class="Text u-textSizeLg">
            ${asElement(doc.data.we_introduction)}
          </div>
        </div>
      </div>
    </div>
  </div>
  `

  return html`
    <main class="View-container View-container--fill">
      ${state.ui.isPartial ? first : html`
        <div>
          <section id="about">
            ${first}
              <h2 class="u-textSizeLg u-textBold u-textCenter u-spaceV8">
                ${text`Some of our clients`}
              </h2>
            <div class="u-spaceB6">
              ${workspace(state, doc)}
            </div>
              <h2 class="u-textSizeLg u-textBold u-textCenter u-spaceV8">
                ${text`Team`}
              </h2>
            <div class="View-grid u-spaceB6">
              ${doc.data.coworkers.map(coworker(state, doc))}
            </div>
          </section>
          <section id="services" class="u-spaceT8">
            <div class="View-grid u-spaceT8">
              <div class="View-cell u-lg-size1of3"></div>
              <div class="View-cell u-lg-size2of3 u-spaceT8">
                <div class="Text u-textSizeLg u-spaceT8">
                  ${asElement(doc.data.create_introduction)}
                </div>
              </div>
            </div>
            <div class="View-grid u-spaceB8">
              <div class="View-cell u-lg-size1of3"></div>
              <div class="View-cell u-lg-size2of3">
                <div class="Text u-textSizeLg">
                  ${asElement(doc.data.create_services_introduction)}
                </div>
              </div>
            </div>
            <div class="View-grid">
              ${doc.data.services.map((props, index, list) => html`
                <article class="View-cell u-md-size1of3 u-spaceV8">
                  <img src="${props.image.url}" class="u-spaceB4 u-alignSelfStart">
                  <h3 class="u-textBold u-textSizeSm">${asText(props.title)}</h3>
                  <div class="Text u-textSizeSm u-spaceT2">
                    ${asElement(props.description)}
                  </div>
                </article>
              `)}
            </div>
          </section>
          <section id="process" class="u-spaceT8 u-spaceTP8">
            <div class="View-grid">
              <div class="View-cell u-lg-size1of3"></div>
              <div class="View-cell u-lg-size2of3">
                <div class="Text u-textSizeLg">
                  ${asElement(doc.data.good_introduction)}
                </div>
              </div>
            </div>
          </section>
          <section id="clients" class="u-spaceV8">
            <div class="u-nbfc">
            ${doc.data.testimonies.length ? html`
              <h2 class="u-textSizeLg u-textBold u-textCenter u-spaceV8">
                ${text`What people say`}
              </h2>
            ` : null}
              <div class="u-clip">
                <div class="View-grid u-spaceT4">
                  ${doc.data.testimonies.map((props, index, list) => {
                    const background = props.color.split(' ').reduce((str, part) => {
                      return str + part[0].toUpperCase() + part.substr(1)
                    }, '') || 'white'

                    return html`
                      <div class="View-cell u-md-size1of2 u-lg-size1of3 u-row u-aspect ${index === 2 ? 'u-lg-show' : ''} u-spaceB4">
                        <div class="u-sizeFill u-flex u-column u-theme${background} u-color u-bg">
                          <div class="u-sizeFill u-flex u-column u-spaceA4">
                            <div class="u-sizeFill">
                              <img width="150" src="${props.logotype.url}">
                            </div>
                            <blockquote class="Display Display--4 u-spaceB6 u-spaceT8">
                              ${asElement(props.quote)}
                            </blockquote>
                            <div class="u-textSizeSm">
                              ${asElement(props.cite)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      `}
    </main>
  `
}

function workspace (state, doc) {
  const image = doc.data.workspace_image

  return html`
    <div class="Card Card--banner" id="ncid-7290" data-nanocomponent="ncid-7290" data-onloadidtzmc="o14">
      ${state.cache(Figure, `'workspace'-${Figure.id(image)}`, { sizes: 'third' }).render(image, false, 'Card-figure')}
    </div>
  `
}

function coworker (state, doc) {
  return function (person, index, list) {
    const id = asText(person.name).trim().toLowerCase().replace(/[^\w]+/g, '')
    const children = [
      html`
        <div class="View-cell u-size1of2 u-lg-size1of3 u-spaceT6">
          <article class="Link Link--aspect Button-wrapper">
            ${person.image.url ? state.cache(Figure, `${id}-${Figure.id(person.image)}`, { sizes: 'third' }).render(person.image) : null}
            <h3 class="u-textBold u-textSizeSm u-spaceT2">${asText(person.name)}</h3>
            <p class="u-textSizeSm">${person.role}</p>
            ${state.cache(ContactInfo, ContactInfo.id(person)).render(person)}
          </article>
        </div>
      `
    ]

    if (index === (Math.floor((list.length - 1) / 2) - 1)) {
      children.push(html`
        <div class="View-cell u-md-size1of2 u-lg-size1of3 u-spaceT6">
          <div class="Card u-themePetrol u-bg u-color">
            <article class="u-flex u-column u-spaceA4">
              <div class="u-sizeFill u-flex u-column u-justifyCenter">
                <h3>
                  <span class="u-textSizeLg u-textBold">${text`Want a job?`}</span>
                  <span class="Display Display--2 u-spaceT2">${doc.data.recruitment_heading}</span>
                  <span class="u-textSizeSm">${text`Talk to Hannah, she’s nice.`}</span>
                </h3>
              </div>
              <h4 class="u-textBold">${text`Careers`}</h4>
              <div class="Text u-textSizeSm">
                <p>
                  <a href="mailto:hannah@thenewdivision.world">hannah@tnd.world</a>
                  <br />
                  <a href="tel:+46733889915">+46 733 889 915</a>
                </p>
              </div>
            </article>
          </div>
        </div>
      `)
    }

    return children
  }
}

var ContactInfo = class ContactInfo extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.cache = state.cache
    this.local = state.components[id] = {}
    this.narrow = true
  }

  static id (person) {
    const first = person.bio[0]
    return (first.text)
      .toLowerCase()
      .split(' ')
      .slice(0, 6)
      .map((word) => word.replace(/[^\w]/g, ''))
      .join('-')
  }

  load () {
    const self = this
    const onresize = nanoraf(function () {
      self.narrow = window.innerWidth < 700
      self.rerender()
    })

    onresize()

    window.addEventListener('resize', onresize, { passive: true })
    this.unmount = function () {
      window.removeEventListener('resize', onresize)
    }
  }

  update () {
    return false
  }

  expand () {
    this.local.expanded = true
    this.rerender()
  }

  createElement (person) {
    const expanded = typeof window === 'undefined' || this.local.expanded
    const first = person.bio[0]
    let email = person.email ? person.email.split('@')[0] : null

    email = email ? (this.narrow ? email + '@tnd.world' : email + '@thenewdivision.world') : null

    return html`
      <div id="${this.id}">
        <div class="Text u-textSizeXs u-spaceT2">
          ${asElement([first])}
          ${expanded ? asElement(person.bio.slice(1)) : null}
          ${(expanded && html`
            <p class="Text u-textSizeXs u-spaceT2">
              ${person.email ? html`<div>Email: <a class="u-textNowrap" href="mailto:${person.email}">${email}</div></a>` : null}
              ${person.phone ? html`<div>Phone: <a class="u-textNowrap" href="tel:${person.phone}">${person.phone}</div></a>` : null}
            </p>
          `) || null}
        </div>
        ${!expanded && person.bio.length > 1 ? button(text`More info`, { color: 'white', wrap: true, onclick: () => this.expand() }) : null}
      </div>
    `
  }
}

function meta (state) {
  const doc = state.documents.items.find((doc) => doc.type === 'about')
  if (!doc) return { title: text`Loading` }
  return {
    title: text`About`,
    'og:image': '/share.png',
    description: doc.data.summary[0].text
  }
}
