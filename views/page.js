const html = require('choo/html')
const view = require('../components/view')
const Slices = require('../components/slices')
const { asText, src, HTTPError } = require('../components/base')

module.exports = view(wildcard, meta, { resolve: getOpts })

function wildcard (state, emit) {
  const uid = state.params.wildcard ? state.params.wildcard : 'home'
  return state.prismic.getByUID('page', uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      console.log('----------------------------------------------------')
      console.log('-------LOADING--------------------------------------')
      console.log('----------------------------------------------------')
      return html`
        <div class="u-container">
          <div style="height: 80vh"></div>
        </div>
      `
    }
    return html`
      <div class="u-container">
        ${state.cache(Slices, `page-${uid}-slices`).render(doc.data.body, { light: doc.data.light })}
      </div>
    `
  })
}

function meta (state) {
  const uid = state.params.wildcard ? state.params.wildcard : 'home'
  return state.prismic.getByUID('page', uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    const props = {
      title: uid === 'home' ? null : asText(doc.data.title),
      description: asText(doc.data.description)
    }

    const share = doc.data.share

    if (share && share.url) {
      Object.assign(props, {
        'og:image': state.origin + src(share.url, 1200),
        'og:image:width': 1200,
        'og:image:height': Math.round(1200 * share.dimensions.height / share.dimensions.width)
      })
    }

    return props
  })
}

function getOpts (state) {
  const uid = state.params.wildcard ? state.params.wildcard : 'home'
  return state.prismic.getByUID('page', uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return {}
    const opts = {
      background: doc.data.light ? '#ffffff' : '#010101',
      color: doc.data.light ? '#000000' : '#ffffff'
    }
    if (doc.data.theme) {
      opts.themed = true
      opts.background = doc.data.background ? doc.data.background : opts.background
      opts.color = doc.data.color ? doc.data.color : opts.color
    }
    return opts
  })
}
