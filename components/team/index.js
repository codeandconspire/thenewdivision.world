const html = require('choo/html')

module.exports = team
function team (items) {
  return html`
    <div class="Team ${items.length === 4 ? 'Team--alt' : ''}">
      ${items.map(function (item) {
        const { figure, title, position, intro } = item
        return html`
          <div class="Team-item">
            ${figure}
            <h3 class="Team-title">${title}</h3>
            ${position ? html`<p>${position}</p>` : null}
            ${intro ? html`<div class="Team-body">${intro}</div>` : null}
          </div>
        `
      })}
    </div>
  `
}
