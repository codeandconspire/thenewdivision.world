const html = require('choo/html')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Intro = require('../components/intro')
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
      <h2 id="cases" class="Display Display--md Display--bold u-spaceBlg">Case studies</h2>
      <div class="Grid">
        ${doc.data.featured_cases.map(props => html`
          <div class="Grid-cell Grid-cell--cases">
            <a href="/cases/${props.case.uid}" class="Link Link--adaptive u-block u-aspectAlt u-spaceBsm">
              ${state.cache(Figure, `case-${props.case.uid}`).render(props.image)}
              <h3 class="Display Display--bold">${asText(props.case.data.title)}</h3>
              <p>${asText(props.case.data.preamble)}</p>
            </a>
          </div>
        `)}
      </div>
    </main>
  `
}
