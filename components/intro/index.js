const html = require('choo/html')
const { className } = require('../base')

module.exports = intro

function intro (props = {}) {
  const classes = className('Intro', {
    'Intro--larger': props.larger,
    'Intro--wrapped': props.wrapped
  })

  return html`
    <div class="${classes}">
      <div class="Intro-layout">
        <div class="Intro-content">
          <h1 class="Intro-title">${props.title}</h1>
          ${props.body ? html`
            <div class="Intro-body">
              <div class="RichText RichText--adaptive">
                ${props.body}
              </div>
            </div>
          ` : null}
        </div>
      </div>
    </div>
  `
}
