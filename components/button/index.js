var html = require('choo/html')

module.exports = button

// render button
// (any, obj?) -> HTMLElement
function button (content, opts = {}) {
  var color = opts.color || 'gray'
  var attrs = {
    onclick: opts.onclick || null,
    class: `Button u-color${color[0].toUpperCase() + color.substr(1)}`
  }

  if (opts.wrap) attrs.class += ' Button--wrap'

  if (opts.href) {
    attrs.href = opts.href

    if (opts.target) {
      attrs.target = opts.target
      if (opts.target === '_blank') attrs.rel = 'noopener noreferrer'
    }

    return html`
      <a ${attrs}>
        <span class="Button-plus"><span class="Button-circle"></span></span>
        ${content}
      </a>
    `
  }

  return html`
    <button ${attrs}>
      <span class="Button-plus"><span class="Button-circle"></span></span>
      ${content}
    </button>
  `
}
