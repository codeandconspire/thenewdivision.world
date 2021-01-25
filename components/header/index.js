const html = require('choo/html')
const Component = require('choo/component')

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.text = state.text
    this.local = state.components[id] = { id, href: state.href }
  }

  static minimal (onclick = null) {
    return html`
      <div class="Header">
        <div class="Header-content">
          <a href="/" rel="home" class="Header-home" onclick=${onclick}>
            <div class="Header-logo">The New Division…</div>
          </a>
        </div>
      </div>
    `
  }

  update (href, props = {}) {
    const shouldUpdate = (href !== this.href) ||
      (props.internal !== this.internal) ||
      (props.adaptive !== this.adaptive) ||
      (props.theme !== this.theme)
    this.href = href
    this.internal = props.internal
    this.adaptive = props.adaptive
    this.theme = props.theme
    return shouldUpdate
  }

  createElement (href, props = {}) {
    const { text } = this
    let { theme, internal, adaptive, onclick } = props

    if (!theme && adaptive) {
      theme = 'blue'
    }

    return html`
      <header class="Header theme-${theme} ${adaptive ? 'Header--adaptive' : ''} ${internal ? 'Header--internal' : ''}" id="${this.local.id}">
        <nav class="Header-content">
          <a href="/" rel="home" class="Header-home" onclick=${onclick}>
            <span class="u-hiddenVisually">${text`Home`} – ${text`SITE_NAME`}</span>
          </a>

          ${internal ? html`
            <ul class="Header-nav">
              <li class="Header-item">
                <a class="Header-link" href="/trips" onclick=${onclick}>${text`Search history`}</a>
              </li>
            </ul>
          ` : html`
            <ul class="Header-nav ${href === '/explore' || href === '/support' || href === '/product' || href === '/gift-cards' ? 'is-used' : ''}">
              <li class="Header-item ${href === '/explore' ? 'is-active' : ''}">
                <a class="Header-link" href="/explore" onclick=${onclick}>${text`Explore`}</a>
              </li>
              <li class="Header-item ${href === '/support' ? 'is-active' : ''}">
                <a class="Header-link" href="/support" onclick=${onclick}>${text`Support`}</a>
              </li>
              <li class="Header-item ${href === '/product' ? 'is-active' : ''}">
                <a class="Header-link" href="/product" onclick=${onclick}>${text`About`}</a>
              </li>
              <li class="Header-item Header-item--extra ${href === '/gift-cards' ? 'is-active' : ''}">
                <a class="Header-link" href="/gift-cards" onclick=${onclick}>${text`Gift Cards`}</a>
              </li>
            </ul>
          `}
        </nav>
      </header>
    `
  }
}
