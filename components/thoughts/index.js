const html = require('choo/html')

module.exports = thoughts
function thoughts (items, title = null) {
  return html`
    <section class="Thoughts">
      ${title ? html`<h2 class="Thoughts-title">${title}</h2>` : null}
      ${items.map(function (item) {
        const { date, title } = item
        return html`
          <div class="Thoughts-item">
            ${date ? html`<span class="Thoughts-date">${date}</span>` : null}
            <div class="Thoughts-title">
              ${title}
            </div>
          </div>
        `
      })}
    </section>
  `
}
