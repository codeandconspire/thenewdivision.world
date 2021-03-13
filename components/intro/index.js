const html = require('choo/html')

module.exports = intro

function intro (props = {}) {
  return html`
    <div class="Intro">
      <div class="Intro-content">
        ${props.label ? html`<span class="Intro-label">${props.label}</span>` : null}
        ${props.title}
        ${props.intro ? html`
          <div class="Intro-body">
            <div class="Words">
              ${props.intro}
            </div>
          </div>
        ` : null}
      </div>
    </div>
  `
}
