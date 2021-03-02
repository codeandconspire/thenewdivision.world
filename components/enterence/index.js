const html = require('choo/html')
const Component = require('choo/component')
const Clients = require('../clients')
const { text, a } = require('../base')

module.exports = class Enterence extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
  }

  update () {
    return true
  }

  createElement (props = {}) {
    const logos = Clients.logos(this.state, this.rerender.bind(this))
    const { title, client, figure, link, label } = props
    console.log('asdfkjahsdfasdfhasjdfhasdfhasjdf', figure)
    return html`
      <div class="Enterence">
        <div class="Enterence-figure">
          ${figure}
          ${label ? html`<span class="Enterence-label">${label}</span>` : null}
        </div>
        <div class="Enterence-client">
          <div class="Enterence-title">
            ${title}
            ${a(link, { class: 'Enterence-link' }, text`Read more`)}
          </div>
          <div class="Enterence-client">
            ${client ? logos(client) : null}
          </div>
        </div>
      </div>
    `
  }
}
