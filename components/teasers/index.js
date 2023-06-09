const html = require('choo/html')
const { a } = require('../base')

module.exports = teasers

function teasers (items) {
  return html`
    <div class="Teasers">
      <ul class="Teasers-list">
        ${items.map(function (item) {
          return html`
            <li class="Teasers-item">
              <div class="Teasers-figure">${item.figure}</div>
              <div class="Teasers-body">
                ${item.label
                  ? html`<span class="Teasers-label">${item.label}</span>`
                  : null}
                ${item.title
                  ? html`
                      <h4 class="Teasers-title">
                        ${a(
                          item.link,
                          { class: 'Teasers-link' },
                          item.title
                        )}
                      </h4>
                    `
                  : null}
              </div>
            </li>
          `
        })}
      </ul>
    </div>
  `
}
