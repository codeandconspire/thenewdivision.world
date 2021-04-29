module.exports = navigation

function navigation (state, emitter) {
  // emitter.on('lazy:error', onnavigate)
  // emitter.on('lazy:success', onnavigate)
  // emitter.on('pushState', onnavigate)

  emitter.on('scrolltop', function () {
    if (typeof window === 'undefined') return
    window.scrollTo(0, 0)
  })
}
