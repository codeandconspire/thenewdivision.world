const html = require('choo/html')
const Component = require('choo/component')
const Takeover = require('../takeover')
const { i18n } = require('../base')

const text = i18n(require('./lang.json'))

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
  }

  update (route) {
    return route !== this.route
  }

  createElement (route) {
    this.route = route
    const self = this

    let isHomepage = route === '/'

    return html`
      <div class="View-header" id="${this.id}">
        ${!isHomepage ? html`
          <a href="/" class="View-home" onmouseover=${prefetch({type: 'homepage'})} ontouchstart=${prefetch({type: 'homepage'})}>
            <span class="u-hiddenVisually">The New Division</span>
            ${logo()}
          </a>
        ` : html`
          <div class="View-home">
            <h1 class="u-hiddenVisually">The New Division</h1>
            ${logo()}
          </div>
        `}

        ${!isHomepage ? html`
          <nav>
            <a class="View-nav" href="/" onclick=${explode('white')} onmouseover=${prefetch({type: 'homepage'})} ontouchstart=${prefetch({type: 'about'})}>
              <svg width="10" height="10" viewBox="0 0 10 10" class="View-navIcon">
                <path fill-rule="evenodd" fill="currentColor" d="M6.4 5L10 8.6 8.6 10 5 6.4 1.4 10 0 8.6 3.6 5 0 1.4 1.4 0 5 3.6 8.6 0 10 1.4 6.4 5z"/>
              </svg> ${text`Close`}
            </a>
          </nav>
        ` : html`
          <nav>
            <a class="View-nav" href="/about" onclick=${explode('sand')} onmouseover=${prefetch({type: 'about'})} ontouchstart=${prefetch({type: 'about'})}>${text`About`}</a>
          </nav>
        `}
      </div>
    `

    function prefetch (query) {
      return function () {
        const doc = self.state.documents.items.find((item) => item.type === query.type)
        if (!doc) self.emit('doc:fetch', query, {silent: true})
      }
    }

    function explode (theme) {
      return function (event) {
        const href = event.target.pathname
        self.state.cache(Takeover, Takeover.id()).open(href, event.target.getBoundingClientRect(), theme)
        window.requestAnimationFrame(function () {
          self.render(href)
        })
        event.preventDefault()
      }
    }
  }
}

function logo () {
  return html`
    <svg class="View-logo" width="344" height="106" viewBox="0 0 344 106" role="presentation">
      <g fill="none" fill-rule="evenodd">
        <path fill="currentColor" d="M17.4 19.4H36v5.7h-5.8v36h-7v-36h-5.8zm34.8 23.3h-6.8v18.4h-7V19.4h7V37h6.8V19.4h7.1v41.7h-7.1zm11.5-23.3h16.8v5.7h-9.8V37h7v5.7h-7v12.7h9.8v5.7H63.7zm32.5 15.5v26.2h-5.9V19.4h6.9l7.5 23.9V19.4h5.9v41.7h-6.2zM115 19.4h16.8v5.7h-9.7V37h6.9v5.7h-6.9v12.7h9.7v5.7H115zm34.8 15.9l-4 25.8h-6.6l-5.6-41.7h6.8l3.3 26.4 3.5-26.4h5.8l3.9 26.4 3.2-26.4h5.9l-5.4 41.7H154l-4.2-25.8zm47.2-4.7v19.3c0 6.4-2.6 11.2-10 11.2h-11V19.4h11c7.4 0 10 4.7 10 11.2zm-11 24.8c3 0 4-1.7 4-4.3V29.3c0-2.5-1-4.2-4-4.2h-2.9v30.3h3zm14.8 5.7h7.1V19.4h-7.1zm32.7-41.7l-8 41.7h-7.6L210 19.4h7.1l4.8 29.1h.1l4.9-29.1zm2 41.7h7V19.4h-7zm10.5-9v-5.6h6.5v5.8c0 2.3 1 3.7 3.4 3.7 2.2 0 3.2-1.5 3.2-3.7v-1.6c0-2.4-1-4-3.1-6l-4.1-4c-4-4-5.9-6.4-5.9-11.2V28c0-5.1 3-9.1 9.9-9.1 7 0 9.8 3.4 9.8 9.5v3.3h-6.5v-3.6c0-2.4-1-3.6-3.3-3.6-2 0-3.3 1.1-3.3 3.5v.8c0 2.4 1.3 3.7 3.3 5.7l4.5 4.5c3.8 3.8 5.7 6.2 5.7 10.8v2c0 5.8-3.1 9.8-10.2 9.8-7.2 0-10-4-10-9.5m23 9h7V19.4h-7zm10.8-10.8V30.1c0-6.5 3.2-11.2 10.6-11.2 7.5 0 10.7 4.7 10.7 11.2v20.2c0 6.5-3.2 11.3-10.7 11.3-7.4 0-10.6-4.8-10.6-11.3m14.2 1.2V29c0-2.5-1-4.3-3.6-4.3-2.5 0-3.6 1.8-3.6 4.3v22.5c0 2.5 1.1 4.3 3.6 4.3s3.6-1.8 3.6-4.3m16.7-16.6v26.2h-5.9V19.4h6.9l7.6 23.9V19.4h5.9v41.7h-6.2zM180.8 97.3h-2.5v-1.9h7.2v1.9H183v6.8h-2.2zm5.8-1.9h4l1.4.2a2.7 2.7 0 0 1 1.8 2.7c0 .6-.1 1.1-.4 1.5a4 4 0 0 1-1.2 1l2 3.3h-2.4l-1.7-3h-1.3v3h-2.2v-8.7zm3.9 4c.3 0 .6-.1.8-.3.3-.2.4-.5.4-.8a1 1 0 0 0-.4-.8c-.2-.2-.5-.2-.8-.2h-1.7v2h1.7zm8.5 4.9c-.6 0-1.2 0-1.7-.3-.5-.2-1-.5-1.4-1-.3-.4-.6-.8-.8-1.4-.2-.5-.3-1.1-.3-1.8 0-.6 0-1.2.3-1.8l.8-1.4c.4-.4.9-.8 1.4-1 .5-.2 1.1-.3 1.8-.3a3.9 3.9 0 0 1 4 2.7l.3 1.8c0 .7-.1 1.3-.3 1.8-.2.6-.5 1-.9 1.4a3 3 0 0 1-1.3 1l-1.8.3m0-1.7a1.9 1.9 0 0 0 1.6-.8l.4-.9a4.5 4.5 0 0 0 0-2.2l-.4-.9a2 2 0 0 0-.7-.6l-1-.2c-.3 0-.6 0-.8.2a2 2 0 0 0-.7.6l-.4.9a4.4 4.4 0 0 0 0 2.2l.4.9.7.6.9.2m5.4-7.2h2.2v6.9h3.9v1.8h-6.1zm7.2 0h2.1v6.9h3.9v1.8h-6zm7.1 0h4.2l1.2.2.9.4c.5.5.7 1 .7 1.7 0 .4-.1.8-.3 1a2 2 0 0 1-1 .7c.6.2 1 .5 1.2.8.3.4.4.9.4 1.4 0 .4 0 .8-.2 1.1l-.6.8c-.6.4-1.3.6-2.2.6h-4.3v-8.7zm4 3.5c.2 0 .5 0 .7-.2.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.6-.2-.2-.5-.3-.8-.3H221V99h1.7zm0 3.5c.4 0 .7 0 1-.3l.2-.7c0-.4 0-.6-.3-.8-.2-.2-.5-.3-.8-.3h-2v2.1h2zm6.9-7h2.2l3.1 8.7h-2.2l-.5-1.5h-3l-.6 1.5h-2.1l3-8.7zm2 5.6l-.6-2a6.8 6.8 0 0 1-.3-1.3l-.2.4a9.6 9.6 0 0 0-.2.8l-.7 2.1h2zm7.6 3.3c-.6 0-1.2 0-1.7-.3a4 4 0 0 1-2.3-2.4 5 5 0 0 1-.3-1.8l.3-1.8c.2-.5.5-1 .9-1.4a4 4 0 0 1 1.3-1l1.8-.3c.5 0 1 0 1.4.2l1 .5c.5.3.8.7 1 1l.4 1.4h-2.2c0-.4-.2-.7-.5-1-.3-.2-.6-.3-1.1-.3a1.8 1.8 0 0 0-1.6.8l-.4.8a4.5 4.5 0 0 0 0 2.2l.5.9.6.6 1 .2c.4 0 .8-.2 1-.4.4-.3.5-.7.6-1h2.1a3.4 3.4 0 0 1-2.2 2.9l-1.6.2m4.9-8.9h2.2v3.2l2.9-3.2h2.6l-3.3 3.5 3.5 5.2h-2.5l-2.5-3.7-.7.7v3h-2.2zm24.8 8.9c-.6 0-1.2 0-1.7-.3a4 4 0 0 1-2.2-2.4 5.2 5.2 0 0 1 0-3.6l.8-1.4a4 4 0 0 1 1.4-1c.5-.2 1-.3 1.7-.3.5 0 1 0 1.4.2l1.1.5.9 1c.2.5.4 1 .4 1.4h-2.1a2 2 0 0 0-.6-1c-.2-.2-.6-.3-1-.3a1.8 1.8 0 0 0-1.6.8l-.4.8a4.5 4.5 0 0 0 0 2.2c0 .4.2.6.4.9l.7.6.8.2c.5 0 1-.2 1.2-.4.3-.3.5-.7.5-1h2.2a3.4 3.4 0 0 1-2.3 2.9l-1.6.2m8.9 0c-.7 0-1.3 0-1.8-.3-.5-.2-1-.5-1.4-1-.3-.4-.6-.8-.8-1.4-.2-.5-.3-1.1-.3-1.8 0-.6 0-1.2.3-1.8l.8-1.4c.4-.4.9-.8 1.4-1 .5-.2 1.1-.3 1.8-.3a3.9 3.9 0 0 1 4 2.7l.3 1.8c0 .7-.1 1.3-.3 1.8-.2.6-.5 1-.9 1.4a3 3 0 0 1-1.3 1l-1.8.3m0-1.7a1.9 1.9 0 0 0 1.6-.8l.4-.9a4.5 4.5 0 0 0 0-2.2l-.4-.9a2 2 0 0 0-.7-.6l-1-.2c-.3 0-.6 0-.8.2a2 2 0 0 0-.7.6l-.4.9a4.4 4.4 0 0 0 0 2.2l.4.9.7.6.9.2m5.4-7.2h2.9l1 3.8a11 11 0 0 1 .4 1.2c0 .3 0 .6.2.8a15.4 15.4 0 0 1 .5-2l1-3.8h3v8.7h-2v-4.8a14 14 0 0 1 0-1.3 24.2 24.2 0 0 0-.4 1.6l-1.3 4.5H287l-1.3-4.4a17.2 17.2 0 0 1-.2-1l-.2-.7a21 21 0 0 0 0 1.8v4.3h-1.9v-8.7zm10.4 0h4c.5 0 1 .1 1.3.3a2.7 2.7 0 0 1 1.7 1.5l.2 1.2c0 .4 0 .8-.2 1.1a2.6 2.6 0 0 1-1.5 1.5c-.4.2-.8.2-1.2.2h-2v3h-2.3v-8.8zm3.8 4.1c.4 0 .7 0 1-.3l.2-.8a1 1 0 0 0-.3-.8c-.2-.2-.5-.3-.9-.3H296v2.2h1.6zm5.9-4.1h2.2l3.1 8.7h-2.2l-.5-1.5h-3l-.6 1.5h-2.1l3-8.7zm2 5.6l-.6-2a6.8 6.8 0 0 1-.3-1.3l-.2.4a9.6 9.6 0 0 0-.2.8l-.7 2.1h2zm4.2-5.6h2.2l2.6 4.4a6.2 6.2 0 0 0 .3.7l.3.4a13.6 13.6 0 0 1 0-1v-4.5h2v8.7h-2l-2.5-4.3-.2-.2-.2-.4-.3-.5a13.9 13.9 0 0 0 0 1.4v4h-2v-8.7zM321 101l-3-5.6h2.3l1.1 2.3.2.5.2.4.2.4a9.6 9.6 0 0 1 .6-1.3l1.1-2.3h2.3l-3 5.5v3.2h-2V101z"/>
        <path fill="currentColor" d="M253.4 98.9h3.5v-3.4h1.7v3.4h3.5v1.7h-3.5v3.5h-1.7v-3.5h-3.5z"/>
        <path fill="currentColor" d="M229.5 94.8c.5 0 .8-.4.8-.9a.9.9 0 0 0-1.7 0c0 .5.4.9.9.9m2.5 0c.5 0 .9-.4.9-.9s-.4-.9-.9-.9c-.4 0-.8.4-.8.9s.4.9.8.9m-62.1 9.4c-.3 0-.6 0-.8-.2-.3 0-.4-.3-.6-.5v.6h-1.1v-6.3h1.2v2.3l.5-.5.8-.2c.2 0 .5 0 .7.2l.7.5.4.7.1 1-.1 1-.4.8a1.8 1.8 0 0 1-1.4.6m-.3-1c.3 0 .6-.1.7-.3.2-.3.3-.6.3-1 0-.5 0-.8-.3-1.1a.8.8 0 0 0-.7-.4 1 1 0 0 0-.8.4l-.2.5v.6c0 .4 0 .7.2 1 .2.2.5.3.8.3m2.7 1.4h.5l.5-.1.1-.5v-.4a7.7 7.7 0 0 0-.3-.8l-1.2-3.3h1.2l.7 2 .1.4.1.4.1.3.1-.3v-.4l.2-.3.6-2h1.2l-1.5 4.6-.3.7-.3.4a1 1 0 0 1-.5.2 2 2 0 0 1-.6 0h-.7v-.9zM0 80h343.8V.5H.1v79.3zm3.4-3.4h337.1V3.9H3.4v72.7z"/>
      </g>
    </svg>
  `
}
