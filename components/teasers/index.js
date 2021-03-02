const html = require('choo/html')
const Component = require('choo/component')
const { a, text } = require('../base')

module.exports = class Teasers extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
  }

  update () {
    return true
  }

  createElement (items) {
    return html`
      <div class="Teasers">
        <ul class="Teasers-list">
          ${items.map(function (item) {
            return html`
              <li class="Teasers-item">
                <div class="Teasers-figure">
                  ${item.figure}
                </div>
                <div class="Teasers-body">
                  ${item.label ? html`<span class="Teasers-label">${item.label}</span>` : null}
                  ${item.title ? html`<h4 class="Teasers-title">${item.title}</h4>` : null}
                  ${a(item.link, { class: 'Teasers-link' }, text`Read more`)}
                </div>
              </li>
            `
          })}
        </ul>
      </div>
    `
  }
}
