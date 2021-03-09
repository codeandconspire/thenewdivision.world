const html = require('choo/html')

module.exports = quotes

function quotes (items, logos) {
  return html`
    <div class="Quotes">
      ${items.map(function (item) {
        const { content, client, author } = item
        return html`
          <div class="Quotes-item">
            ${client ? html`
              <div class="Quotes-client">
                ${logos(item.client)}
              </div>
            ` : null}
            <div class="Quotes-content">
              ${content}
            </div>
            <div class="Quotes-author">
              ${author}
            </div>
          </div>
        `
      })}
    </div>
  `
}
