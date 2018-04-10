const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Card = require('../components/card')
const Good = require('../components/good')
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
      <main class="View-container">
      </main>
    `
  }

  return html`
    <main class="View-container View-container--fill">
      ${presentation(['we', 'create', 'good', 'forces'].map(key => asElement(doc.data[key])))}
      <section id="about-us">
        <div class="Grid u-spaceVxl">
          <div class="Grid-cell Grid-cell--1of3"></div>
          <div class="Grid-cell Grid-cell--2of3">
            <div class="Text Text--large">
              ${asElement(doc.data.we_introduction)}
            </div>
          </div>
        </div>
        <div class="Grid u-spaceBlg">
          ${doc.data.coworkers.map(coworker(state, doc))}
        </div>
        ${state.cache(Card, 'workspace').render(workspace(doc))}
      </section>
      <section id="our-services">
        <div class="Grid u-spaceVxl">
          <div class="Grid-cell Grid-cell--1of3"></div>
          <div class="Grid-cell Grid-cell--2of3">
            <div class="Text Text--large">
              ${asElement(doc.data.create_introduction)}
            </div>
          </div>
        </div>
        <div class="Grid">
          ${doc.data.services.map((props, index, list) => html`
            <article class="Grid-cell Grid-cell--1of${list.length}">
              <img src="${props.image.url}" class="u-spaceBmd u-alignSelfStart">
              <hr>
              <h3 class="Display Display--sm">${asText(props.title)}</h3>
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
        <h2 class="Display Display--md Display--bold u-textCenter u-spaceBxl">
          ${text`What people say`}
        </h2>
        <div class="Grid">
          ${doc.data.testimonies.map((props, index, list) => {
            const backgorund = props.color.split(' ').reduce((str, part) => {
              return str + part[0].toUpperCase() + part.substr(1)
            }, '') || 'white'

            return html`
              <div class="Grid-cell Grid-cell--1of${list.length} u-row u-aspect">
                <div class="u-sizeFill u-flex u-column u-theme${backgorund} u-color u-bg">
                  <div class="u-sizeFill u-flex u-column u-spaceAmd">
                    <div class="u-sizeFill">
                      <img src="${props.logotype.url}">
                    </div>
                    <blockquote class="Display Display--lg u-textGiorgio u-spaceBmd">
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
      <div class="u-sizeFill u-flex u-column">
        <div class="u-sizeFill u-flex u-column u-justifyCenter">
          <h3>
            <span class="Display Display--sm">${text`Address`}</span>
            <span class="Display Display--sm">${doc.data.address[0].text}</span>
          </h3>
          <div class="Text">
            <p>${doc.data.address.slice(1).map(part => [part.text, html`<br>`])}</p>
          </div>
        </div>
        <h4 class="Display Display--sm">${text`Inquiries`}</h4>
        <div class="Text Text--large">
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
        <article class="Grid-cell Grid-cell--1of3">
          ${state.cache(Card, id).render({children: html`
            <img class="Card-image" src="${person.image.url}" alt="${person.image.alt || ''}">
          `})}
          <h3 class="Display Display--md Display--bold">${asText(person.name)}</h3>
          <div class="Text">
            <p class="Display Display--md">${person.role}</p>
            ${asElement(person.bio)}
          </div>
        </article>
      `
    ]

    if (index === Math.floor((list.length - 1) / 2)) {
      children.push(html`
        <article class="Grid-cell Grid-cell--1of3">
          ${state.cache(Card, 'recruit').render({
            color: 'petrol',
            children: html`
              <div class="u-flex u-column">
                <div class="u-sizeFill u-flex u-column u-justifyCenter">
                  <h3>
                    <span class="Display Display--sm">${text`Want a job?`}</span>
                    <span class="Display Display--sm">${doc.data.recruitment_heading}</span>
                  </h3>
                </div>
                <h4 class="Display Display--sm">${text`Careers`}</h4>
                <div class="Text Text--large">
                  <p>
                    <a href="mailto:hannah@thenewdivision.world">hannah@thenewdivision.world</a>
                    <a href="tel:+46701234567">+46 (0)70 123 45 67</a>
                  </p>
                </div>
              </div>
            `
          })}
        </article>
      `)
    }

    return children
  }
}

function title () {
  return text`About`
}
