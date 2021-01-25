const html = require('choo/html')
const intro = require('../intro')
const { className } = require('../base')

module.exports = media

function media (figure, props) {
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
        ${props.title ? html`
          <div class="Media-content">
            ${intro({
              center: true,
              wrapped: true,
              title: props.title,
              label: props.label,
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
