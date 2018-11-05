module.exports = reset

function reset (state, emitter) {
  // properly reset eventbus on ssr
  if (typeof window === 'undefined') emitter.removeAllListeners()
  emitter.on('DOMTitleChange', function (title) {
    state.title = title
  })

  if (state.prefetch) delete state.status

  // prevent leaking component state in-between renders
  state.components = Object.create({
    toJSON () {
      return {}
    }
  })
}
