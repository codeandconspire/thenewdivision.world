const html = require('choo/html')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Intro = require('../components/intro')
const { i18n } = require('../components/base')
const Figure = require('../components/figure')
const Takeover = require('../components/takeover')

const text = i18n()

module.exports = view(home)

function home (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'white' && !state.ui.isPartial) {
    emit('ui:theme', 'white')
  }

  const doc = state.documents.items.find((doc) => doc.type === 'homepage')
  if (!doc) {
    emit('doc:fetch', {type: 'homepage'})
    return html`
      <main class="View-container View-container--nudge View-container--fill">
      </main>
    `
  }

  emit('meta', {
    image: 'https://www.thenewdivision.world/share.png',
    title: 'The New Division',
    description: Intro.getWords(doc.data.intro).join(' ')
  })

  return html`
    <main class="View-container View-container--nudge">
      <div class="${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
        ${state.cache(Intro, `intro-partial:${state.ui.isPartial}`, {static: state.ui.inTransition}).render(doc.data.intro)}
      </div>
      <section id="cases">
        <h2 class="u-textSizeLg u-textBold ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? 'animation-delay: 250ms;' : ''}">
          ${text`Case studies`}
        </h2>
        <div class="View-grid View-grid--tight">
          ${doc.data.featured_cases.map((props, i) => html`
            <div class="View-cell u-md-size1of2 u-spaceT3 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? `animation-delay: ${300 - 100 * (i % 2)}ms;` : ''}">
              <a href="${state.documents.resolve(props.case)}" class="Link--splash u-spaceB2" onclick=${explode} onmouseover=${prefetch(props.case.id)} ontouchstart=${prefetch(props.case.id)}>
                ${state.cache(Figure, `${props.case.uid}-${Figure.id(props.image)}`, {interactive: true, sizes: [['50vw', 600]]}).render(props.image)}
                <h3 class="u-textBold u-spaceT1">${asText(props.case.data.title)}</h3>
                <p>${asText(props.case.data.description)}</p>
              </a>
            </div>
          `)}
        </div>
      </section>
    </main>
  `

  function explode (event) {
    const plus = event.currentTarget.querySelector('.js-plus')
    state.cache(Takeover, Takeover.id()).open(event.currentTarget.pathname, plus.getBoundingClientRect())
    event.preventDefault()
  }

  function prefetch (id) {
    return function () {
      const doc = state.documents.items.find((item) => item.id === id)
      if (!doc) emit('doc:fetch', {id}, {silent: true})
    }
  }
}
