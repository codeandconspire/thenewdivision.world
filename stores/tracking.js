/* global gtag */

module.exports = tracking

function tracking (state, emitter) {
  if (typeof gtag !== 'function') return

  emitter.on('navigate', function () {
    gtag('config', 'G-B8MM2HGXEV', {
      page_title: state.title,
      page_path: state.href
    })
  })
}
