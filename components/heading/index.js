const html = require('choo/html')
const { a, icon, text } = require('../base')

module.exports = heading

function heading (props = {}) {
  const { text, label } = props
  console.log(props)
  return html`
    <div class="Heading">
      ${props.label ? html`<span>${label}</span>` : null}
      ${text}
    </div>
  `
}
