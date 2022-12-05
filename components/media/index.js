const html = require('choo/html')
const { className, a, text } = require('../base')

module.exports = media

function media (figure, props = {}) {
  if (!figure) return null
  const classes = className('Media', {
    'Media--dark': props.dark
  })
  return html`
    <div class="${classes}">
      <div class="Media-container">
        <div class="Media-figure">
          ${figure}
        </div>
        ${props.title
          ? html`
              <div class="Media-content">
                ${props.label ? html`<div class="Media-label">${props.label}</div>` : null}
                <h3 class="Media-title">${props.title}</h3>
                ${a(props.link, { class: 'Media-link' }, text`Read more about: ${props.title}`)}
              </div>
            `
          : null}
      </div>

      ${props.caption
        ? html`
            <span class="Media-caption">${props.caption}</span>
          `
        : null}
    </div>
  `
}
