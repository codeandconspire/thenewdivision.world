const html = require('choo/html')
const { a, icon } = require('../base')

module.exports = callout

function callout (props = {}) {
  const { heading, content, link } = props
  return html`
    <section class="Callout ${props.loose ? 'Callout--loose' : ''}">
      <hr aria-hidden="true" class="u-hiddenVisually" />
      ${props.icon ? icon(props.icon, { class: 'Callout-icon' }) : null}
      <div>
        ${heading
          ? html`<h2 class="Callout-title">
              ${link ? a(link, { class: 'Callout-link' }, heading) : heading}
            </h2>`
          : null}
        ${content ? html`<div class="Callout-body">${content}</div>` : null}
      </div>
    </section>
  `
}
