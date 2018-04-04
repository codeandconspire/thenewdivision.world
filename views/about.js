const html = require('choo/html')
const asElement = require('prismic-element')
const { asText} = require('prismic-richtext')
const view = require('../components/view')
const { i18n } = require('../components/base')
const { Figure } = require('../components/link')
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
        <div class="Grid">
          ${doc.data.coworkers.map((person, index, list) => {
            const id = asText(person.name).trim().replace(/[^\w+]/, '-')
            const children = [
              html`
                <article class="Grid-cell Grid-cell--1of3">
                  ${state.cache(Figure, id).render(person.image)}
                  <h3 class="Display Display--3">${asText(person.name)}</h3>
                  <div class="Text">
                    <p>${person.role}</p>
                    ${asElement(person.bio)}
                  </div>
                </article>
              `
            ]

            if (index === Math.floor((list.length - 1) / 2)) {
              children.push(html`
                <article class="Grid-cell Grid-cell--1of3">
                  <div class="u-fill u-flex u-column u-bgPetrol u-colorWhite">
                    <div class="u-fill u-flex u-column u-justifyCenter">
                      <h3>
                        <span class="Display Display--3">${text`Want a job?`}</span>
                        <span class="Display Display--2">${doc.data.recruitment_heading}</span>
                      </h3>
                    </div>
                    <h4 class="Display Display--3">${text`Careers`}</h4>
                    <div class="Text Text--large">
                      <p>
                        <a href="mailto:hannah@thenewdivision.world">hannah@thenewdivision.world</a>
                        <a href="tel:+46701234567">+46 (0)70 123 45 67</a>
                      </p>
                    </div>
                  </div>
                </article>
              `)
            }

            return children
          })}
        </div>
      </section>
    </main>
  `
}

function title () {
  return text`About`
}
