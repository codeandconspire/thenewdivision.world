const html = require('choo/html')
const view = require('../components/view')
const Intro = require('../components/intro')

const intro = new Intro()

module.exports = view(home)

function home (state, emit) {
  const doc = state.documents.items.find(doc => doc.type === 'homepage')

  if (!doc) {
    if (state.documents.error) throw state.documents.error
    if (!state.documents.loading) emit('doc:fetch', {type: 'homepage'})
    return html`
      <main class="View-container">
      </main>
    `
  }

  return html`
    <main class="View-container">
      ${intro.render(doc.data.intro)}
    </main>
  `
}
