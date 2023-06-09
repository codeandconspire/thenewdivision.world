const html = require('choo/html')
const { a } = require('../base')

module.exports = cases

function cases (items, title, pushed) {
  return html`
    <section class="Cases ${pushed ? 'Cases--pushed' : ''}">
      ${title ? html`<h3 class="Cases-title">${title}</h3>` : null}
      ${items.map(function (item) {
        const { title, client, link } = item
        return html`
          <div class="Cases-item">
            <div class="Cases-name">
              ${a(link, { class: 'Cases-link' }, title)}
            </div>
            ${client}
          </div>
        `
      })}
    </section>
  `
}
