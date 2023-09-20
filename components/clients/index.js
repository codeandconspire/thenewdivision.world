const html = require('choo/html')
const Component = require('choo/component')
const { Predicates } = require('prismic-javascript')
const { asText } = require('../base')

module.exports = class Clients extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.fetched = []
  }

  static fetch (state, render) {
    // if (this.fetched) return this.fetched
    const predicate = Predicates.at('document.type', 'client')
    const opts = { pageSize: 100, render }
    this.fetched = state.prismic.get(predicate, opts, function (err, res) {
      if (err || !res || !res.results_size) return null
      return res.results.map(function (doc) {
        const hasLight = doc.data.logo_light || doc.data.logo_light.url
        const hasDark = doc.data.logo_dark || doc.data.logo_dark.url
        if (!hasLight && !hasDark) return null
        return doc
      })
    })
    return this.fetched
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
    let logo

    return function (id, opts = {}) {
      if (!clients) {
        return html`
          <div class="Clients ${opts.small ? 'Clients--small' : ''} ${opts.large ? 'Clients--large' : ''}">
            <div class="Clients-item">
              <div class="Clients-loading"></div>
            </div>
          </div>
        `
      }

      const client = self.match(id, clients)
      if (!client) return null

      const hasLight = client.data.logo_light.length || client.data.logo_light.url
      const hasDark = client.data.logo_dark.length || client.data.logo_dark.url

      if ((opts.dark && hasDark) || (!hasLight)) {
        logo = client.data.logo_dark
      } else {
        logo = client.data.logo_light
      }

      if (!logo) return null

      const { width, height } = logo.dimensions
      const attrs = {
        width,
        height,
        class: 'Clients-img',
        draggable: 'false',
        alt: ''
      }

      if (client.data.title) {
        attrs.title = asText(client.data.title)
        attrs.alt = attrs.title
      }

      return html`
        <div class="Clients ${opts.small ? 'Clients--small' : ''} ${opts.large ? 'Clients--large' : ''}" style="--Clients-size: ${(height / width).toFixed(2)};">
          <div class="Clients-item">
            <img ${attrs} src="/media/fetch/_/${encodeURIComponent(logo.url)}">
          </div>
        </div>
      `
    }
  }

  update () {
    return false
  }

  static list (state, render) {
    const self = this
    const clients = self.fetch(state, render)

    return function (opts = {}) {
      if (!clients) {
        return html`
          <div class="Clients Clients--large">
            <div class="Clients-list">
              <div class="Clients-item"><div class="Clients-loading"></div></div>
              <div class="Clients-item"><div class="Clients-loading"></div></div>
              <div class="Clients-item"><div class="Clients-loading"></div></div>
              <div class="Clients-item"><div class="Clients-loading"></div></div>
              <div class="Clients-item"><div class="Clients-loading"></div></div>
              <div class="Clients-item"><div class="Clients-loading"></div></div>
            </div>
          </div>
        `
      }

      return html`
        <div class="Clients Clients--large ${clients.length % 2 ? 'Clients--odd' : ''}">
          <ul class="Clients-list">
            ${clients.map(function (client) {
              if (client.data.unlisted) return null
              let logo

              const hasLight = client.data.logo_light.length || client.data.logo_light.url
              const hasDark = client.data.logo_dark.length || client.data.logo_dark.url

              if ((opts.dark && hasDark) || (!hasLight)) {
                logo = client.data.logo_dark
              } else {
                logo = client.data.logo_light
              }

              if (!logo) return null

              const { width, height } = logo.dimensions
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
                <li class="Clients-item" style="--Clients-size: ${(height / width).toFixed(2)};">
                  <img ${attrs} src="/media/fetch/_/${encodeURIComponent(logo.url)}">
                </li>
              `
            })}
          </ul>
        </div>
      `
    }
  }

  createElement (opts = {}) {
    return html`
      <div class="Clients"></div>
    `
  }
}
