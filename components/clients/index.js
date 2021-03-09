const html = require('choo/html')
const Component = require('choo/component')
const { Predicates } = require('prismic-javascript')
const { asText } = require('../base')

module.exports = class Clients extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
  }

  static fetch (state, render) {
    const predicate = Predicates.at('document.type', 'client')
    const opts = { pageSize: 100, render }
    return state.prismic.get(predicate, opts, function (err, res) {
      if (err || !res || !res.results_size) return null
      return res.results.map(function (doc) {
        if (!doc.data.logo_light || !doc.data.logo_light.url) return null
        return doc
      })
    })
  }

  static match (id, clients) {
    if (!id) return
    return clients.find(function (client) {
      if (id === client.id) return true
      return false
    })
  }

  static logos (state, render) {
    const self = this
    const clients = self.fetch(state, render)

    return function (id) {
      if (!clients) {
        return html`
          <div class="Clients Clients--standalone">
            <div class="Clients-loading"></div>
          </div>
        `
      }
      const client = self.match(id, clients)
      if (!client) return null
      const { width, height } = client.data.logo_light.dimensions
      const attrs = {
        width,
        height,
        class: 'Clients-img',
        draggable: 'false',
        loading: 'lazy',
        alt: ''
      }

      if (client.data.title) {
        attrs.title = asText(client.data.title)
        attrs.alt = attrs.title
      }

      return html`
        <div class="Clients Clients--standalone">
          <img ${attrs} src="/media/fetch/_/${encodeURIComponent(client.data.logo_light.url)}">
        </div>
      `
    }
  }

  update () {
    return true
  }

  createElement (props = {}) {
    const clients = Clients.fetch(this.state)
    if (!clients) {
      return html`<div></div>`
    }

    return html`
      <div class="Clients">
        <ul class="Clients-list">
          ${clients.map(function (doc) {
            if (doc.data.unlisted) return null
            const { width, height } = doc.data.logo_light.dimensions
            const attrs = {
              width,
              height,
              class: 'Clients-img',
              draggable: 'false',
              loading: 'lazy',
              alt: ''
            }

            if (doc.data.title) {
              attrs.title = asText(doc.data.title)
              attrs.alt = attrs.title
            }

            return html`
              <li class="Clients-item">
                <img ${attrs} src="/media/fetch/_/${encodeURIComponent(doc.data.logo_light.url)}">
              </li>
            `
          })}
        </ul>
      </div>
    `
  }
}
