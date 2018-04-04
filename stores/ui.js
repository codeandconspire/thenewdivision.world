module.exports = ui

function ui (state, emitter) {
  // circumvent choo default scroll-to-anchor behavior
  emitter.on('navigate', function () {
    const el = document.getElementById(state.params.anchor)

    if (!el) return

    const from = window.scrollY
    window.requestAnimationFrame(function () {
      // reset scroll to where it was before navigate
      window.scrollTo(window.scrollX, from)
      window.requestAnimationFrame(function () {
        // smoothly scroll element into view when everything has settled
        el.scrollIntoView({behavior: 'smooth', block: 'start'})
      })
    })
  })
}
