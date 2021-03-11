const html = require('choo/html')

module.exports = words
function words (props) {
  return html`
    <section class="Words ${props.pushed ? 'Words--pushed' : ''} ${props.half ? 'Words--half' : ''} ${props.columns ? 'Words--columns' : ''}">
      ${props.header ? html`
        <div class="Words-header">${props.header}</div>
      ` : null}
      <div class="Words-main">${props.main}</div>
    </section>
  `
}
