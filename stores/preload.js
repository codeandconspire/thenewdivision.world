const { asSlice } = require('../components/slices')
module.exports = preload

function preload (state, emit) {
  const loaded = []
  emit.on('preload', preload)

  function preload (link) {
    if (loaded.includes(link.uid)) return
    if (link.type !== 'page') return
    if (typeof window === 'undefined') return

    state.prismic.getByUID('page', link.uid, function (err, doc) {
      if (err || !doc) return null
      loaded.push(link.uid)

      setTimeout(function () {
        const photo = doc.data.body.slice(0, 3).find(function (item) {
          const type = item.slice_type
          if (type === 'photo' || type === 'enterence' || type === 'banner') return item
          return false
        })
        if (photo) {
          const elm = asSlice(photo, 1, { state, id: 'preload' })
          elm.classList.add('u-hiddenVisually')
          document.querySelector('.js-slices').appendChild(elm)
        }
      }, 3000)
      return doc
    })
  }
}
