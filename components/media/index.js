const html = require('choo/html')
const { className, a } = require('../base')

module.exports = media

function media (figure, props = {}) {
  if (!figure) return null
  const classes = className('Media', {
    'Media--dark': props.dark
  })
  return html`
    <div class="${classes}">
      <div class="Media-container">
        <div class="Media-figure">${figure}</div>
        ${props.title
          ? html`
              <div class="Media-content">
                ${props.label
                  ? html`<div class="Media-label">${props.label}</div>`
                  : null}
                <h3 class="Media-title">
                  ${a(
                    props.link,
                    { class: 'Media-link' },
                    props.title
                  )}
                </h3>
              </div>
            `
          : null}
      </div>

      ${props.caption
        ? html` <span class="Media-caption">${props.caption}</span> `
        : null}
    </div>
  `
}
