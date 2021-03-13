const html = require('choo/html')

module.exports = reel

function reel (items, opts) {
  return html`
    <div class="Reel" style="--Reel-count: ${items.length}; --Reel-delay: ${opts.delay ? opts.delay : '4.0'}s;">
      ${opts.title ? html`<h1 class="u-hiddenVisually">${opts.title}</h1>` : null}
      ${items.map(function (item) {
        const { quote, author, desc, client } = item
        return html`
          <div class="Reel-item">
            <div class="Reel-quote">
              ${quote}
            </div>
            ${client ? html`
              <div class="Reel-client">
                ${opts.logos(item.client)}
              </div>
            ` : null}
            <p class="Reel-author">
              <strong>${author}</strong>
              <br />
              ${desc}
            </p>
          </div>
        `
      })}
    </div>
  `
}
