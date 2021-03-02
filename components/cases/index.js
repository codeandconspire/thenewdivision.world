const html = require('choo/html')
const Component = require('choo/component')
const Clients = require('../clients')

module.exports = class Cases extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
  }

  update () {
    return true
  }

  createElement (items) {
    const logos = Clients.logos(this.state, this.rerender.bind(this))
    return html`
      <div class="Cases">
        ${items.map(function (item) {
          const { title, client } = item
          return html`
            <div class="Cases-item">
              <div class="Cases-title">
                ${title}
              </div>
              ${client ? logos(item.client) : null}
            </div>
          `
        })}
      </div>
    `
  }
}
