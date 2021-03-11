const html = require('choo/html')
const intro = require('../intro')
const { className } = require('../base')

module.exports = media

function media (figure, props = {}) {
  if (!figure) return null
  const classes = className('Media', {
    'Media--banner': props.title,
    'Media--backdrop': props.backdrop,
    'Media--white': props.white
  })
  return html`
    <div class="${classes}">
      <div class="Media-container">
        <div class="Media-figure">
          ${figure}
        </div>
        ${props.label ? html`<div class="Media-label">${props.label}</div>` : null}
        ${props.title ? html`
          <div class="Media-content">
            ${intro({
              wrapped: true,
              title: props.title,
              children: props.children
            })}
          </div>
        ` : null}
      </div>

      ${props.caption ? html`
        <span class="Media-caption">${props.caption}</span>
      ` : null}
    </div>
  `
}
