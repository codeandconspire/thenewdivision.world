const html = require('choo/html')
const { loader, className } = require('../base')

module.exports = intro

function intro (props = {}) {
  const center = props.center && !props.icon
  const classes = className('Intro', {
    'Intro--center': center,
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
              <div class="RichText RichText--adaptive ${center ? 'RichText--middle' : ''}">
                ${props.body}
              </div>
            </div>
          ` : null}
        </div>
      </div>
    </div>
  `
}
