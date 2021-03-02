const html = require('choo/html')

module.exports = news
function news (items) {
  return html`
    <div class="News">
      ${items.map(function (item) {
        const { date, title } = item
        return html`
          <div class="News-item">
            ${date ? html`<span class="News-date">${date}</span>` : null}
            <div class="News-title">
              ${title}
            </div>
          </div>
        `
      })}
    </div>
  `
}
