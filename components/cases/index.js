const html = require('choo/html')

module.exports = cases

function cases (items, logos) {
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
