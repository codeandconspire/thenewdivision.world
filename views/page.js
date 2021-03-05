const html = require('choo/html')
const view = require('../components/view')
const asElement = require('prismic-element')
const Slices = require('../components/slices')
const intro = require('../components/intro')
const { asText, src, HTTPError, resolve, serialize } = require('../components/base')

module.exports = view(wildcard, meta, { resolve: getOpts })

function wildcard (state, emit) {
  return state.prismic.getByUID('page', state.params.wildcard, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) {
      return html`
        <div class="u-container">
          <div style="height: 80vh"></div>
        </div>
      `
    }

    return html`
      <div class="u-container">
        ${intro({
          title: asText(doc.data.title),
          body: doc.data.description ? asElement(doc.data.description, resolve, serialize) : null
        })}
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
  return state.prismic.getByUID('page', state.params.wildcard, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return {}
    const opts = {
      background: doc.data.light ? '#ffffff' : '#000000',
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
