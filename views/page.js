const html = require('choo/html')
const view = require('../components/view')
const asElement = require('prismic-element')
const Slices = require('../components/slices')
const intro = require('../components/intro')
const { asText, src, HTTPError, resolve, serialize } = require('../components/base')

module.exports = view(wildcard, meta)

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

    console.log(props)

    return props
  })
}
