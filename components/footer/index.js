const html = require('choo/html')
const Component = require('choo/component')

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <footer class="Footer" id="${this.local.id}">
        <div class="u-container">
          Footer…
        </div>
      </footer>
    `
  }
}
