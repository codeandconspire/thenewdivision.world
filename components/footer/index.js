const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { a, icon } = require('../base')

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
    this.local = state.components[id] = { id }
  }

  update () {
    return false
  }

  createElement (data) {
    if (!data) return

    return html`
      <footer class="Footer" id="${this.local.id}">
        <div class="u-container">
          <div class="Footer-col" role="contentinfo">
            <p>${data.col1}</p>
          </div>
          <ul class="Footer-col">
            ${data.col2.map(function (item) {
              const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon' })} ${item.text}` : item.text
              return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link' }, children)}</li>`
            }).filter(Boolean)}
          </ul>
          <ul class="Footer-col">
            ${data.col3.map(function (item) {
              const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon' })} ${item.text}` : item.text
              return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link' }, children)}</li>`
            }).filter(Boolean)}
          </ul>
          <ul class="Footer-col">
            ${data.col4.map(function (item) {
              const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon' })} ${item.text}` : item.text
              return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link' }, children)}</li>`
            }).filter(Boolean)}
          </ul>
          <address class="Footer-col">
            ${asElement(data.col5)}
          </address>
          <div class="Footer-col">
            ${asElement(data.col6)}
          </div>
        </div>
      </footer>
    `
  }
}
