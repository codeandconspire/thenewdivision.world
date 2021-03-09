module.exports = navigation

function navigation (state, emitter) {
  emitter.on('lazy:error', onnavigate)
  emitter.on('lazy:success', onnavigate)
  emitter.on('pushState', onnavigate)

  function onnavigate () {
    if (typeof window === 'undefined') return
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
      })
    })
  }
}
