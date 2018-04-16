const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Card = require('../components/card')
const Good = require('../components/good')
const { Figure } = require('../components/link')
const { i18n } = require('../components/base')
const presentation = require('../components/presentation')
require('../components/grid')
require('../components/text')

const text = i18n()

module.exports = view(about, title)

function about (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'brown') {
    emit('ui:theme', 'brown')
  }

  const doc = state.documents.items.find(doc => doc.type === 'about')
  if (!doc) {
    if (!state.documents.loading) emit('doc:fetch', {type: 'about'})
    return html`
      <main class="View-container"></main>
    `
  }

  return html`
    <main class="View-container View-container--fill">
      ${presentation(['we', 'create', 'good', 'forces'].map(key => asElement(doc.data[key])))}
      <section id="about-us">
        <div class="Grid u-spaceVlg">
          <div class="Grid-cell u-lg-size1of3"></div>
          <div class="Grid-cell u-lg-size2of3">
            <div class="Text u-textSizeLg">
              ${asElement(doc.data.we_introduction)}
            </div>
          </div>
        </div>
        <div class="Grid u-spaceBmd">
          ${doc.data.coworkers.map(coworker(state, doc))}
        </div>
        ${state.cache(Card, 'workspace').render(workspace(doc))}
      </section>
      <section id="our-services">
        <div class="Grid u-spaceVlg">
          <div class="Grid-cell u-lg-size1of3"></div>
          <div class="Grid-cell u-lg-size2of3">
            <div class="Text u-textSizeLg">
              ${asElement(doc.data.create_introduction)}
            </div>
          </div>
        </div>
        <div class="Grid">
          ${doc.data.services.map((props, index, list) => html`
            <article class="Grid-cell u-md-size1of3">
              <img src="${props.image.url}" class="u-spaceBsm u-alignSelfStart">
              <hr>
              <h3>${asText(props.title)}</h3>
              <div class="Text">
                ${asElement(props.description)}
              </div>
            </article>
          `)}
        </div>
      </section>
      <section id="who-we-help">
        ${state.cache(Good, 'good').render(doc.data)}
      </section>
      <section id="clients-and-friends">
        <h2 class="u-textSizeLg u-textBold u-textCenter u-spaceBmd">
          ${text`What people say`}
        </h2>
        <div class="Grid">
          ${doc.data.testimonies.map((props, index, list) => {
            const background = props.color.split(' ').reduce((str, part) => {
              return str + part[0].toUpperCase() + part.substr(1)
            }, '') || 'white'

            return html`
              <div class="Grid-cell u-md-size1of2 u-lg-size1of3 u-spaceTmd u-row u-aspect ${index === 2 ? 'u-lg-show' : ''}">
                <div class="u-sizeFill u-flex u-column u-theme${background} u-color u-bg">
                  <div class="u-sizeFill u-flex u-column u-spaceAsm">
                    <div class="u-sizeFill">
                      <img src="${props.logotype.url}">
                    </div>
                    <blockquote class="Display Display--4 u-spaceBsm">
                      ${asElement(props.quote)}
                    </blockquote>
                    ${asElement(props.cite)}
                  </div>
                </div>
              </div>
            `
          })}
        </div>
      </section>
    </main>
  `
}

function workspace (doc) {
  return {
    color: 'darkBlue',
    image: doc.data.workspace_image,
    caption: doc.data.workspace_image.alt,
    children: html`
      <div class="u-sizeFill u-flex u-column u-spaceAsm">
        <div class="u-sizeFill u-flex u-column u-justifyCenter">
          <h3>
            <span class="u-textSizeLg u-textBold">${text`Address`}</span>
            <span class="Display Display--2">
              ${doc.data.address[0].text.split('\n').reduce((els, part, index, list) => {
                return els.concat(part, index < list.length - 1 ? html`<br>` : null)
              }, [])}
            </span>
          </h3>
          <div class="Text">
            <p>${doc.data.address.slice(1).map(part => [part.text, html`<br>`])}</p>
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
    const id = asText(person.name).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^-\w]+/g, '')
    const children = [
      html`
        <div class="Grid-cell u-size1of2 u-lg-size1of3 u-spaceTmd">
          <article class="Link Link--aspect">
            ${state.cache(Figure, `coworker-${id}`).render(person.image)}
            <h3 class="u-textBold">${asText(person.name)}</h3>
            <div class="Text">
              <p>${person.role}</p>
              <div class="u-textSizeXs u-md-show">${asElement(person.bio)}</div>
            </div>
          </article>
        </div>
      `
    ]

    if (index === Math.floor((list.length - 1) / 2)) {
      children.push(html`
        <div class="Grid-cell u-md-size1of2 u-lg-size1of3 u-spaceTmd">
          ${state.cache(Card, 'recruit').render({
            color: 'petrol',
            children: html`
              <article class="u-flex u-column u-spaceAsm">
                <div class="u-sizeFill u-flex u-column u-justifyCenter">
                  <h3>
                    <span class="u-textSizeLg u-textBold">${text`Want a job?`}</span>
                    <span class="Display Display--2">${doc.data.recruitment_heading}</span>
                    <span>${text`Talk to Hannah, she’s nice.`}</span>
                  </h3>
                </div>
                <h4 class="u-textBold">${text`Careers`}</h4>
                <div class="Text">
                  <p>
                    <a href="mailto:hannah@thenewdivision.world">hannah@thenewdivision.world</a>
                    <br />
                    <a href="tel:+46701234567">+46 (0)70 123 45 67</a>
                  </p>
                </div>
              </article>
            `
          })}
        </div>
      `)
    }

    return children
  }
}

function title () {
  return text`About`
}
