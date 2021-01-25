const html = require('choo/html')
const intro = require('../intro')

let DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    const flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err, state, emit) {
  return html`
    <div class="u-container">
      ${intro({
        larger: true,
        center: true,
        title: 'Page not found',
        body: html`
          ${DEBUG ? html`<pre>${err.stack}</pre>` : null}
        `
      })}
    </div>
  `
}
