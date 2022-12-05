const html = require('choo/html')
const { text, a } = require('../base')

module.exports = enterence

function enterence (props = {}) {
  const { title, client, figure, link, color, label, small } = props
  return html`
    <div class="Enterence ${small ? 'Enterence--small' : ''}">
      <div class="Enterence-figure">
        ${figure}
        ${label ? html`<span class="Enterence-label Enterence-label--${color}">${label}</span>` : null}
      </div>
      <div class="Enterence-meta">
        <div class="Enterence-title">
          ${title}
          ${a(link, { class: 'Enterence-link' }, text`Read more about: ${title}`)}
        </div>
        ${client
          ? html`
              <div class="Enterence-client">
                ${client}
              </div>
            `
          : null}
      </div>
    </div>
  `
}
