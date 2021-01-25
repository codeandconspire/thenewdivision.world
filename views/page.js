const html = require('choo/html')
const view = require('../components/view')
const asElement = require('prismic-element')
const Slices = require('../components/slices')
const intro = require('../components/intro')
const { asText, src, HTTPError, resolve, serialize } = require('../components/base')

module.exports = view(wildcard, meta, { resolve: resolveOptions })

function wildcard (state, emit) {
  return state.prismic.getByUID('page', state.params.wildcard, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <div class="u-container">
          ${intro({
            loading: true,
            body: true,
            center: true,
            larger: true
          })}
          <div style="height: 80vh;"></div>
        </div>
      `
    }

    if (doc.data.body && doc.data.center) {
      doc.data.body = doc.data.body.map(function (slice) {
        slice.center = true
        return slice
      })
    }

    const image = doc.data.background && doc.data.background.url
    const props = {
      center: doc.data.center,
      larger: doc.data.large_intro,
      title: asText(doc.data.headline) ? asText(doc.data.headline) : asText(doc.data.title),
      wrapped: !!image,
      label: doc.data.label ? asText(doc.data.label) : null,
      body: doc.data.intro ? asElement(doc.data.intro, resolve, serialize) : null
    }

    return html`
      <div class="u-container">
        ${intro(props)}
      </div>
      ${state.cache(Slices, `page-${state.params.wildcard}-slices`).render(doc.data.body)}
    `
  })
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.wildcard, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null
    const props = {
      title: asText(doc.data.title),
      description: doc.data.description
    }

    const featured = doc.data.featured_image
    const background = doc.data.background
    const share = featured.url ? featured : background.url ? background : null

    if (share && share.url) {
      Object.assign(props, {
        'og:image': state.origin + src(share.url, 1200),
        'og:image:width': 1200,
        'og:image:height': 1200 * share.dimensions.height / share.dimensions.width
      })
    }

    return props
  })
}

function resolveOptions (state) {
  return state.prismic.getByUID('page', state.params.wildcard, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return {}

    const opts = {}
    if (doc.data.background && doc.data.background.url) {
      opts.header = 'adaptive'
    }
    return opts
  })
}
