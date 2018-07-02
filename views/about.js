var html = require('choo/html')
var Component = require('choo/component')
var asElement = require('prismic-element')
var {asText} = require('prismic-richtext')
var view = require('../components/view')
var Card = require('../components/card')
var Wheel = require('../components/wheel')
var intro = require('../components/intro')
var {i18n} = require('../components/base')
var Figure = require('../components/figure')
var button = require('../components/button')

var text = i18n()

module.exports = view(about, title)

function about (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'sand' && !state.ui.isPartial) {
    emit('ui:theme', 'sand')
  }

  var doc = state.documents.items.find((doc) => doc.type === 'about')
  if (!doc && !state.ui.isPartial) {
    emit('doc:fetch', {type: 'about'})
    return html`<main class="View-container View-container--fill"></main>`
  }

  emit('meta', {
    image: 'https://www.thenewdivision.world/share.png',
    description: doc.data.summary[0].text
  })

  var first = html`
  <div>
    <div class="${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
      ${intro(asText(doc.data.summary))}
    </div>
    <div class="${state.ui.isPartial ? 'u-slideInY u-spaceV8' : 'u-spaceV8'}" style="${state.ui.isPartial ? 'animation-delay: 250ms;' : ''}">
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
            <div class="View-grid u-spaceB6">
              ${doc.data.coworkers.map(coworker(state, doc))}
            </div>
            ${state.cache(Card, 'workspace').render(workspace(doc))}
          </section>
          <section id="services" class="u-spaceV8">
            <div class="View-grid u-spaceV8">
              <div class="View-cell u-lg-size1of3"></div>
              <div class="View-cell u-lg-size2of3 u-spaceV8">
                <div class="Text u-textSizeLg u-spaceV8">
                  ${asElement(doc.data.create_introduction)}
                </div>
              </div>
            </div>
            <div class="View-grid">
              ${doc.data.services.map((props, index, list) => html`
                <article class="View-cell u-md-size1of3">
                  <img src="${props.image.url}" class="u-spaceB2 u-alignSelfStart">
                  <h3 class="u-textBold u-textSizeSm">${asText(props.title)}</h3>
                  <div class="Text u-textSizeSm">
                    ${asElement(props.description)}
                  </div>
                </article>
              `)}
            </div>
            ${state.cache(Wheel, 'services-wheel').render(doc)}
          </section>
          <section id="process" class="u-spaceV8">
            <div class="View-grid u-spaceV8">
              <div class="View-cell u-lg-size1of3 u-spaceV8"></div>
              <div class="View-cell u-lg-size2of3 u-spaceV8">
                <div class="Text u-textSizeLg u-spaceV8">
                  ${asElement(doc.data.good_introduction)}
                </div>
              </div>
            </div>
          </section>
          <section id="clients" class="u-spaceV8">
            <h2 class="u-textSizeLg u-textBold u-textCenter u-spaceV8">
              ${text`What people say`}
            </h2>
            <div class="u-clip">
              <div class="View-grid u-spaceT4">
                ${doc.data.testimonies.map((props, index, list) => {
                  var background = props.color.split(' ').reduce((str, part) => {
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
          </section>
        </div>
      `}
    </main>
  `
}

function workspace (doc) {
  return {
    color: 'darkBlue',
    image: doc.data.workspace_image,
    caption: doc.data.workspace_image.alt,
    children: html`
      <div class="u-sizeFill u-flex u-column u-spaceA4">
        <div class="u-sizeFill u-flex u-column u-justifyCenter">
          <h3>
            <span class="u-textSizeLg u-textBold">${text`Address`}</span>
            <span class="Display Display--2 u-spaceT2">
              ${doc.data.address[0].text.split('\n').reduce((els, part, index, list) => {
                return els.concat(part, index < list.length - 1 ? html`<br>` : null)
              }, [])}
            </span>
          </h3>
          <div class="Text u-textSizeSm">
            <p>${doc.data.address.slice(1).map((part) => [part.text, html`<br>`])}</p>
          </div>
        </div>
        <h4 class="u-textBold">${text`Inquiries`}</h4>
        <div class="Text">
          <p>
            <a href="mailto:hello@thenewdivision.world">hello@thenewdivision.world</a>
          </p>
        </div>
      </div>
    `
  }
}

function coworker (state, doc) {
  return function (person, index, list) {
    var id = asText(person.name).trim().toLowerCase().replace(/[^\w]+/g, '')
    var children = [
      html`
        <div class="View-cell u-size1of2 u-lg-size1of3 u-spaceT6">
          <article class="Link Link--aspect">
            ${person.image.url ? state.cache(Figure, `${id}-${Figure.id(person.image)}`, {interactive: false, aspect: true, sizes: [[`${100 / 3}vw`, 1000], ['50vw']]}).render(person.image) : null}
            <h3 class="u-textBold u-textSizeSm u-spaceT2">${asText(person.name)}</h3>
            <p class="u-textSizeSm">${person.role}</p>
            ${state.cache(ContactInfo, ContactInfo.id(person)).render(person)}
          </article>
        </div>
      `
    ]

    if (index === Math.floor((list.length - 1) / 2)) {
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
                  <a href="mailto:hannah@thenewdivision.world">hannah@thenewdivision.world</a>
                  <br />
                  <a href="tel:+46701234567">+46 (0)70 123 45 67</a>
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
  }

  static id (person) {
    var first = person.bio[0]
    return (first.text)
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

  createElement (person) {
    var expanded = typeof window === 'undefined' || this.local.expanded
    var first = person.bio[0]
    return html`
      <div id="${this.id}">
        <div class="Text u-textSizeXs u-spaceT2">
          ${asElement([first])}
          ${expanded ? asElement(person.bio.slice(1)) : null}
          ${expanded ? html`
            <p class="Text u-textSizeXs u-spaceT2">
              ${person.email ? html`<div>Email: <a href="mailto:${person.email}">${person.email}</div></a>` : null}
              ${person.phone ? html`<div>Phone: <a href="tel:${person.phone}">${person.phone}</div></a>` : null}
            </p>
          ` : null}
        </div>
        ${!expanded && person.bio.length > 1 ? button(() => this.expand(), text`More info`, 'white') : null}
      </div>
    `
  }
}

function title () {
  return text`About`
}
