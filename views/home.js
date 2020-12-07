const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const view = require('../components/view')
const Words = require('../components/words')
const { i18n } = require('../components/base')
const Figure = require('../components/figure')
const Takeover = require('../components/takeover')
const Presentation = require('../components/presentation')

const text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  if (state.documents.error) throw state.documents.error

  if (state.ui.theme !== 'white' && !state.ui.isPartial) {
    emit('ui:theme', 'white')
  }

  const animate = state.ui.isPartial || state.ui.isFirst

  const presentation = state.cache(
    Presentation,
    `presentation-partial:${state.ui.isPartial}`,
    { ltr: state.ui.isFirst && !state.ui.isPartial }
  )

  const doc = state.documents.items.find((doc) => doc.type === 'homepage')
  if (!doc) {
    emit('doc:fetch', { type: 'homepage' })
    return html`
      <main class="View-container View-container--nudge View-container--fill">
      </main>
    `
  }

  return html`
    <main class="View-container">
      ${presentation.render(['we', 'create', 'good', 'forces'].map((key) => asElement(doc.data[key])), { static: !animate })}
      <section id="cases">
        <h2 class="u-hiddenVisually">${text`Case studies`}</h2>
        <div class="View-grid View-grid--tight">
          ${doc.data.featured_cases.map((props, i) => html`
            <div class="View-cell u-md-size1of2 u-spaceT5 ${animate ? 'u-slideIn' : ''}" style="${animate ? `animation-delay: ${delay(i)}ms;` : ''}">
              <a href="${state.documents.resolve(props.case)}" class="Figure-outer" onclick=${explode} onmouseover=${prefetch(props.case.id)} ontouchstart=${prefetch(props.case.id)}>
                ${state.cache(Figure, `${props.case.uid}-${Figure.id(props.image)}:${state.ui.isPartial}`, { interactive: true, size: 'half' }).render(props.image)}
                <h3 class="u-textBold u-spaceT2">${asText(props.case.data.title)}</h3>
                <p>${asText(props.case.data.description)}</p>
              </a>
            </div>
          `)}
        </div>
      </section>
      ${state.ui.isPartial ? null : html`
        <section id="news" class="u-spaceT8 u-nbfc">
          <h2 class="u-textSizeLg u-spaceT8 u-textBold">${text`News`}</h2>
          ${state.cache(Words, `${doc.id}-words`).render(doc.data.words)}
        </section>
      `}
    </main>
  `

  function delay (i) {
    if (state.ui.isFirst) {
      return 250 + 50 * (i % 2)
    } else if (state.ui.isPartial) {
      return 225 - 50 * (i % 2)
    }
  }

  function explode (event) {
    if (state.ui.inTransition) return event.preventDefault()
    const target = event.currentTarget
    const origin = target.querySelector('.js-plus').getBoundingClientRect()
    state.cache(Takeover, Takeover.id()).open(target.pathname, origin)
    event.preventDefault()
  }

  function prefetch (id) {
    return function () {
      const doc = state.documents.items.find((item) => item.id === id)
      if (!doc) emit('doc:fetch', { id }, { silent: true })
    }
  }
}

function meta (state) {
  const doc = state.documents.items.find((doc) => doc.type === 'homepage')
  if (!doc) return { title: text`Loading` }
  return {
    'og:image': '/share.png',
    title: 'The New Division',
    description: doc.data.summary[0].text
  }
}
