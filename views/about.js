var html = require('choo/html')
var asElement = require('prismic-element')
var {asText} = require('prismic-richtext')
var view = require('../components/view')
var Card = require('../components/card')
var Wheel = require('../components/wheel')
var {i18n} = require('../components/base')
var Figure = require('../components/figure')
var Presentation = require('../components/presentation')

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

  var presentation = state.cache(
    Presentation,
    `presentation-partial:${state.ui.isPartial}`,
    {static: !state.ui.isPartial}
  )

  return html`
    <main class="View-container View-container--fill">
      ${presentation.render(['we', 'create', 'good', 'forces'].map((key) => asElement(doc.data[key])))}
      ${state.ui.isPartial ? null : html`
        <div>
          <section id="about" class="u-slideInY">
            <div class="View-grid u-spaceV8">
              <div class="View-cell u-lg-size1of3"></div>
              <div class="View-cell u-lg-size2of3 u-spaceV8">
                <div class="Text u-textSizeLg u-spaceV4">
                  ${asElement(doc.data.we_introduction)}
                </div>
              </div>
            </div>
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
            ${state.cache(Wheel, 'services-wheel').render()}
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
                            <img src="${props.logotype.url}">
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
            ${person.image.url ? state.cache(Figure, `${id}-${Figure.id(person.image)}`, {interactive: true, sizes: [[`${100 / 3}vw`, 1000], ['50vw']]}).render(person.image) : null}
            <h3 class="u-textBold u-textSizeSm">${asText(person.name)}</h3>
            <div class="Text u-textSizeSm">
              <p>${person.role} <br><a href="mailto:${asText(person.bio)}">${asText(person.bio)}</a></p>
            </div>
          </article>
        </div>
      `
    ]

    return children
  }
}

function title () {
  return text`About`
}
