const html = require('choo/html')
const { a, icon, text } = require('../base')

module.exports = callout

function callout (props = {}) {
  const { heading, content, link } = props
  return html`
    <section class="Callout">
      ${props.icon ? html`<div>${icon(props.icon, { class: 'Callout-icon' })}</div>` : null}
      ${heading ? html`<h2>${heading}</h2>` : null}
      ${content ? html`<div>${content}</div>` : null}
      ${link ? a(link, { class: 'Callout-link' }, text`Read more`) : null}
    </section>
  `
}
