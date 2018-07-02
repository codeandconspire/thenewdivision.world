var html = require('choo/html')

module.exports = button

// render button
// (fn, text) -> HTMLElement
function button (onclick, text, color = 'gray') {
  return html`
    <button class="Button u-color${color[0].toUpperCase() + color.substr(1)}" onclick=${onclick}>
      <span class="Button-plus"><span class="Button-circle"></span></span>
      ${text}
    </button>
  `
}
