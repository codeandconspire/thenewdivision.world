const html = require('choo/html')

// render intro
// (text) -> HTMLElement
module.exports = function intro (text) {
  return html`
    <div class="Intro">
      <div class="Intro-text">${text}</div>
    </div>
  `
}
