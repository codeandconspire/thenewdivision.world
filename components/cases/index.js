const html = require('choo/html')
const { a, text } = require('../base')

module.exports = cases

function cases (items, title, logos) {
  return html`
    <div class="Cases">
      ${title ? html`<h3 class="Cases-title">${title}</h3>` : null}
      ${items.map(function (item) {
        const { title, client, link } = item
        return html`
          <div class="Cases-item">
            <div class="Cases-name">
              ${title}
            </div>
            ${client ? logos(item.client) : null}
            ${a(link, { class: 'Cases-link' }, text`View case`)}
          </div>
        `
      })}
    </div>
  `
}
