var html = require('choo/html')

module.exports = button

// render button
// (any, obj?) -> HTMLElement
function button (content, opts = {}) {
  var color = opts.color || 'gray'
  var className = `Button u-color${color[0].toUpperCase() + color.substr(1)}`

  if (opts.wrap) className += ' Button--wrap'

  if (opts.href) {
    return html`
      <a href="${opts.href}" class="${className}" onclick=${opts.onclick || null}>
        <span class="Button-plus"><span class="Button-circle"></span></span>
        ${content}
      </a>
    `
  }

  return html`
    <button class="${className}" onclick=${opts.onclick || null}>
      <span class="Button-plus"><span class="Button-circle"></span></span>
      ${content}
    </button>
  `
}
