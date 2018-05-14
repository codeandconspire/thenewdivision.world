const html = require('choo/html')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Intro = require('../components/intro')
const Words = require('../components/words')
const { i18n } = require('../components/base')
const Figure = require('../components/figure')
require('../components/display')
require('../components/grid')
require('../components/base')

const text = i18n()

module.exports = view(home)

function home (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'white' && !state.ui.isPartial) {
    emit('ui:theme', 'white')
  }

  const doc = state.documents.items.find((doc) => doc.type === 'homepage')
  if (!doc) {
    if (!state.documents.loading) emit('doc:fetch', {type: 'homepage'})
    return html`
      <main class="View-container View-container--nudge">
      </main>
    `
  }

  return html`
    <main class="View-container View-container--nudge">
      <div class="${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
        ${state.cache(Intro, `intro-partial:${state.ui.isPartial}`, {static: state.ui.inTransition}).render(doc.data.intro)}
      </div>
      <section id="cases">
        <h2 class="u-textSizeLg u-textBold u-spaceB2 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 250ms;' : ''}">
          ${text`Case studies`}
        </h2>
        <div class="Grid Grid--tight">
          ${doc.data.featured_cases.map((props, i) => html`
            <div class="Grid-cell u-md-size1of2 u-spaceT3 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? `animation-delay: ${300 - 100 * (i % 2)}ms;` : ''}">
              <a href="${state.documents.resolve(props.case)}" class="Link--splash u-spaceB2">
                ${state.cache(Figure, `${props.case.uid}-${Figure.id(props.image)}`, {interactive: true}).render(props.image)}
                <h3 class="u-textBold u-spaceT1">${asText(props.case.data.title)}</h3>
                <p>${asText(props.case.data.description)}</p>
              </a>
            </div>
          `)}
        </div>
      </section>
      ${state.ui.isPartial ? null : html`
        <section id="words" class="u-spaceT8">
          <h2 class="u-textSizeLg u-textBold">${text`Words`}</h2>
          ${state.cache(Words, `${doc.id}-words`).render(doc.data.words)}
        </section>
      `}
    </main>
  `
}
