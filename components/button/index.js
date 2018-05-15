const html = require('choo/html')

module.exports = button

// render button
// (fn, text) -> HTMLElement
function button (onclick, text) {
  return html`
    <button class="Button u-textSizeSm" onclick=${onclick}>
      <span class="Button-plus"><span class="Button-circle"></span></span>
      ${text}
    </button>
  `
}
