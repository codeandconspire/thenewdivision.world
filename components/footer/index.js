const html = require('choo/html')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { a, icon } = require('../base')

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
    this.local = state.components[id] = { id }
  }

  update (data, opts) {
    if (this.local.themed !== opts.themed) return true
    return false
  }

  createElement (data, opts = {}) {
    this.local.themed = opts.themed
    if (!data) return

    function top () {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
      })
    }

    return html`
      <footer class="Footer" id="${this.local.id}">
        <hr aria-hidden="true" class="u-hiddenVisually">
        <div class="u-container">
          <div class="Footer-wrap">
            <div class="Footer-col" role="contentinfo">
              <svg class="Footer-logo" viewBox="0 0 150 35" width="150" height="35" fill="none" role="presentation">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.57 8.42h8.1v2.47h-2.52v15.62H10.1V10.9H7.57V8.42zm15.16 10.1h-2.97v8h-3.04V8.41h3.04v7.64h2.97V8.42h3.09v18.1h-3.1v-8zm5-10.1h7.32v2.47h-4.27v5.17h3.05v2.47h-3.05v5.51h4.27v2.47h-7.32V8.41zm14.15 6.72v11.37h-2.57V8.41h3l3.27 10.38V8.42h2.57v18.1h-2.7l-3.57-11.38zm8.19-6.72h7.31v2.47h-4.22v5.17h3v2.47h-3v5.51h4.22v2.47h-7.31V8.41zm15.15 6.9l-1.74 11.2H60.6l-2.44-18.1h2.96l1.44 11.45L64.1 8.42h2.52l1.7 11.45 1.4-11.45h2.56l-2.35 18.1h-2.87l-1.83-11.2zm20.55-2.04v8.37c0 2.78-1.14 4.86-4.36 4.86h-4.79V8.41h4.8c3.21 0 4.35 2.05 4.35 4.87zm-4.8 10.76c1.31 0 1.75-.74 1.75-1.87v-9.46c0-1.08-.44-1.82-1.74-1.82h-1.26v13.15h1.3-.04zm6.45 2.47h3.1V8.41h-3.1v18.1zm14.24-18.1l-3.49 18.1h-3.3l-3.44-18.1h3.09l2.09 12.64h.04l2.13-12.63h2.88zm.87 18.1h3.05V8.41h-3.05v18.1zm4.57-3.9v-2.43h2.83v2.52c0 1 .43 1.6 1.48 1.6.96 0 1.4-.65 1.4-1.6V22c0-1.04-.44-1.73-1.36-2.6l-1.78-1.74c-1.74-1.73-2.57-2.78-2.57-4.86v-.65c0-2.21 1.3-3.95 4.31-3.95 3.05 0 4.27 1.48 4.27 4.12v1.44h-2.83v-1.57c0-1.04-.44-1.56-1.44-1.56-.87 0-1.44.48-1.44 1.52v.35c0 1.04.57 1.6 1.44 2.47l1.96 1.95c1.65 1.65 2.48 2.7 2.48 4.7v.86c0 2.52-1.35 4.25-4.44 4.25-3.13 0-4.35-1.73-4.35-4.12h.04zm9.97 3.9h3.05V8.41h-3.05v18.1zm4.7-4.68v-8.77c0-2.82 1.4-4.86 4.62-4.86 3.26 0 4.65 2.04 4.65 4.86v8.77c0 2.82-1.39 4.9-4.65 4.9-3.22 0-4.62-2.08-4.62-4.9zm6.18.52v-9.77c0-1.08-.43-1.86-1.56-1.86-1.1 0-1.57.78-1.57 1.86v9.77c0 1.08.48 1.86 1.57 1.86 1.08 0 1.56-.78 1.56-1.86zm7.27-7.2V26.5h-2.56V8.41h3l3.3 10.38V8.42h2.58v18.1h-2.7l-3.62-11.38z"/>
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M0 34.72h149.68V.22H.04v34.41l-.04.09zm1.48-1.48h146.76V1.7H1.48v31.55z"/>
              </svg>
              <p>${data.col1}</p>
            </div>
            <ul class="Footer-col">
              ${data.col2.map(function (item) {
                const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon', mono: opts.themed })} ${item.text}` : item.text
                return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link', onclick: top }, children)}</li>`
              }).filter(Boolean)}
            </ul>
            <ul class="Footer-col">
              ${data.col3.map(function (item) {
                const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon', mono: opts.themed })} ${item.text}` : item.text
                return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link', onclick: top }, children)}</li>`
              }).filter(Boolean)}
            </ul>
            <ul class="Footer-col">
              ${data.col4.map(function (item) {
                const children = item.icon ? html`${icon(item.icon, { class: 'Footer-icon', mono: opts.themed })} ${item.text}` : item.text
                return html`<li class="Footer-item">${a(item.link, { class: 'Footer-link', onclick: top }, children)}</li>`
              }).filter(Boolean)}
            </ul>
            <address class="Footer-col">
              ${asElement(data.col5)}
            </address>
            <div class="Footer-col">
              ${asElement(data.col6)}
            </div>
          </div>
        </div>
      </footer>
    `
  }
}
