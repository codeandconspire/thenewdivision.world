module.exports = meta

var ROOT = 'https://www.thenewdivision.world'

function meta (state, emitter, app) {
  state.meta = state.prefetch ? {'og:url': ROOT} : state.meta

  emitter.on('meta', function (next) {
    if (next.title !== state.title) emitter.emit('DOMTitleChange', next.title)
    Object.assign(state.meta, next)

    if (typeof window === 'undefined') return

    var url = ROOT + state.href
    var tags = Object.assign({'og:url': url}, next)
    if (next.title && !next['og:title']) tags['og:title'] = next.title

    Object.keys(tags).forEach(key => {
      var el = document.head.querySelector(`meta[property="${key}"]`)
      if (el) el.setAttribute('content', tags[key].replace(/^\//, ROOT + '/'))
    })
  })
}
