module.exports = prefetch

function prefetch (state, emitter) {
  if (!state.prefetch) return

  let queued = 0
  let onresolve, onreject
  const push = state.prefetch.push.bind(state.prefetch)

  state.prefetch.push = function (...args) {
    if (queued === 0) {
      push(new Promise((resolve, reject) => {
        onresolve = resolve
        onreject = reject
      }))
    }

    let error
    push(...args)
    queued += args.length
    Promise.all(args).catch(function (err) {
      error = err
    }).then(function () {
      queued -= args.length
      if (queued === 0) {
        if (error) onreject(error)
        else onresolve()
      }
    })
  }
}
