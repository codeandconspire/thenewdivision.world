const html = require('choo/html')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Intro = require('../components/intro')
const Words = require('../components/words')
const { i18n } = require('../components/base')
const { Figure } = require('../components/link')
require('../components/display')
require('../components/grid')
require('../components/base')

const PREDICATE = {
  type: 'homepage',
  fetchLinks: [
    'case.title',
    'case.preamble'
  ]
}

const text = i18n()

module.exports = view(home)

function home (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'white') {
    emit('ui:theme', 'white')
  }

  const doc = state.documents.items.find(doc => doc.type === 'homepage')
  if (!doc) {
    if (!state.documents.loading) emit('doc:fetch', PREDICATE)
    return html`
      <main class="View-container">
      </main>
    `
  }

  return html`
    <main class="View-container">
      ${state.cache(Intro, 'homepage-intro').render(doc.data.intro)}
      <section id="cases">
        <h2 class="u-textSizeLg u-textBold">Case studies</h2>
        <div class="Grid Grid--tight">
          ${doc.data.featured_cases.map(props => html`
            <div class="Grid-cell u-md-size1of2 u-spaceT3">
              <a href="/cases/${props.case.uid}" class="Link--splash u-spaceB2">
                ${state.cache(Figure, `case-${props.case.uid}`).render(props.image)}
                <h3 class="u-textBold">${asText(props.case.data.title)}</h3>
                <p>${asText(props.case.data.preamble)}</p>
              </a>
            </div>
          `)}
        </div>
      </section>
      <section id="words" class="u-spaceTlg">
        <h2 class="u-textSizeLg u-textBold">${text`Words`}</h2>
        ${state.cache(Words, 'words').render(doc.data.words)}
      </section>
    </main>
  `
}
