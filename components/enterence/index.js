const html = require('choo/html')
const { text, a } = require('../base')

module.exports = enterence

function enterence (props = {}, logos) {
  const { title, client, figure, link, color, label, small } = props
  return html`
    <div class="Enterence ${small ? 'Enterence--small' : ''}">
      <div class="Enterence-figure">
        ${figure}
        ${label ? html`<span class="Enterence-label Enterence-label--${color}">${label}</span>` : null}
      </div>
      <div class="Enterence-client">
        <div class="Enterence-title">
          ${title}
          ${a(link, { class: 'Enterence-link' }, text`Read more`)}
        </div>
        <div class="Enterence-client">
          ${client ? logos(client) : null}
        </div>
      </div>
    </div>
  `
}
