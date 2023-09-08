const html = require('choo/html')

module.exports = thoughts
function thoughts (items, title = null) {
  return html`
    <section class="Thoughts">
      ${title ? html`<h2 class="Thoughts-title">${title}</h2>` : null}
      ${items.map(function (item) {
        const { title } = item
        return html`
          <div class="Thoughts-item">
            ${title}
          </div>
        `
      })}
    </section>
  `
}
