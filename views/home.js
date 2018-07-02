var html = require('choo/html')
var {asText} = require('prismic-richtext')
var view = require('../components/view')
var Intro = require('../components/intro')
var Words = require('../components/words')
var {i18n} = require('../components/base')
var Figure = require('../components/figure')
var Takeover = require('../components/takeover')

var text = i18n()

module.exports = view(home)

function home (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'white' && !state.ui.isPartial) {
    emit('ui:theme', 'white')
  }

  var doc = state.documents.items.find((doc) => doc.type === 'homepage')
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
        <h2 class="u-hiddenVisually">${text`Case studies`}</h2>
        <div class="View-grid View-grid--tight">
          ${doc.data.featured_cases.map((props, i) => html`
            <div class="View-cell u-md-size1of2 u-spaceT5 ${state.ui.isPartial ? 'u-slideInY' : ''}" style="${state.ui.isPartial ? `animation-delay: ${300 - 100 * (i % 2)}ms;` : ''}">
              <a href="${state.documents.resolve(props.case)}" class="Figure-outer" onclick=${explode} onmouseover=${prefetch(props.case.id)} ontouchstart=${prefetch(props.case.id)}>
                ${state.cache(Figure, `${props.case.uid}-${Figure.id(props.image)}:${state.ui.isPartial}`, {interactive: true, sizes: [['50vw', 600]]}).render(props.image)}
                <h3 class="u-textBold u-spaceT2">${asText(props.case.data.title)}</h3>
                <p>${asText(props.case.data.description)}</p>
              </a>
            </div>
          `)}
        </div>
      </section>
      ${state.ui.isPartial ? null : html`
        <section id="words" class="u-spaceT8 u-nbfc">
          <h2 class="u-textSizeLg u-spaceT5 u-textBold">${text`Words`}</h2>
          ${state.cache(Words, `${doc.id}-words`).render(doc.data.words)}
        </section>
      `}
    </main>
  `

  function explode (event) {
    var plus = event.currentTarget.querySelector('.js-plus')
    state.cache(Takeover, Takeover.id()).open(event.currentTarget.pathname, plus.getBoundingClientRect())
    event.preventDefault()
  }

  function prefetch (id) {
    return function () {
      var doc = state.documents.items.find((item) => item.id === id)
      if (!doc) emit('doc:fetch', {id}, {silent: true})
    }
  }
}
