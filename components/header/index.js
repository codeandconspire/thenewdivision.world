const html = require('choo/html')
const { a, text, icon, resolve, className } = require('../base')
const nanoraf = require('nanoraf')
const Component = require('choo/component')

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
    this.preloaded = []
    this.local = state.components[id] = {
      id: id,
      get href () {
        return state.href
      }
    }
  }

  update (data, href) {
    const shouldUpdate = (href !== this.href)
    this.href = href
    return shouldUpdate
  }

  load (el) {
    const menu = document.querySelector('.js-menu')

    function onscroll (event) {
      event.preventDefault()
    }

    const onresize = nanoraf(function () {
      const styles = window.getComputedStyle(document.documentElement)
      if (parseInt(styles.getPropertyValue('--document-narrow'))) {
        menu.addEventListener('touchmove', onscroll, false)
        menu.addEventListener('wheel', onscroll, false)
      } else {
        menu.removeEventListener('touchmove', onscroll, false)
        menu.removeEventListener('wheel', onscroll, false)
      }
    })

    onresize()
    window.addEventListener('resize', onresize)
    return function () {
      window.removeEventListener('resize', onresize)
      menu.removeEventListener('touchmove', onscroll, false)
      menu.removeEventListener('wheel', onscroll, false)
    }
  }

  createElement (data, href) {
    const { prismic, preloaded } = this

    if (!data) return
    const match = this.local.href.match(/^\/([^/]+\/)/)
    let current = this.local.href
    if (match) {
      current = '/' + match[1].substring(0, match[1].length - 1)
    }

    // Preload pages in header
    if (typeof window !== 'undefined') {
      data.header.map(function (item) {
        if (item.link.type !== 'page') return null
        return prismic.getByUID('page', item.link.uid, function (err, doc) {
          if (err || !doc || preloaded.includes(item.link.uid)) return null
          preloaded.push(item.link.uid)
          // setTimeout(function () {
          //   const photo = doc.data.body.slice(0, 3).find(item => item.slice_type === 'photo')
          //   if (photo) document.querySelector('.js-slices').appendChild(asSlice(photo, 1))
          // }, 2000)
          return doc
        })
      })

      prismic.getByUID('page', 'home', function (err, doc) {
        if (err || !doc) return null
        return doc
      })
    }

    function close () {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            document.querySelector('.js-switch').checked = false
          })
        })
      })
    }

    return html`
      <header class="Header u-container" id="${this.local.id}">
        <nav class="Header-wrap">
          <a class="Header-logo" href="/" rel="home">
            <svg role="presentation" viewBox="0 0 150 35" width="150" height="35" fill="none">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.57 8.42h8.1v2.47h-2.52v15.62H10.1V10.9H7.57V8.42zm15.16 10.1h-2.97v8h-3.04V8.41h3.04v7.64h2.97V8.42h3.09v18.1h-3.1v-8zm5-10.1h7.32v2.47h-4.27v5.17h3.05v2.47h-3.05v5.51h4.27v2.47h-7.32V8.41zm14.15 6.72v11.37h-2.57V8.41h3l3.27 10.38V8.42h2.57v18.1h-2.7l-3.57-11.38zm8.19-6.72h7.31v2.47h-4.22v5.17h3v2.47h-3v5.51h4.22v2.47h-7.31V8.41zm15.15 6.9l-1.74 11.2H60.6l-2.44-18.1h2.96l1.44 11.45L64.1 8.42h2.52l1.7 11.45 1.4-11.45h2.56l-2.35 18.1h-2.87l-1.83-11.2zm20.55-2.04v8.37c0 2.78-1.14 4.86-4.36 4.86h-4.79V8.41h4.8c3.21 0 4.35 2.05 4.35 4.87zm-4.8 10.76c1.31 0 1.75-.74 1.75-1.87v-9.46c0-1.08-.44-1.82-1.74-1.82h-1.26v13.15h1.3-.04zm6.45 2.47h3.1V8.41h-3.1v18.1zm14.24-18.1l-3.49 18.1h-3.3l-3.44-18.1h3.09l2.09 12.64h.04l2.13-12.63h2.88zm.87 18.1h3.05V8.41h-3.05v18.1zm4.57-3.9v-2.43h2.83v2.52c0 1 .43 1.6 1.48 1.6.96 0 1.4-.65 1.4-1.6V22c0-1.04-.44-1.73-1.36-2.6l-1.78-1.74c-1.74-1.73-2.57-2.78-2.57-4.86v-.65c0-2.21 1.3-3.95 4.31-3.95 3.05 0 4.27 1.48 4.27 4.12v1.44h-2.83v-1.57c0-1.04-.44-1.56-1.44-1.56-.87 0-1.44.48-1.44 1.52v.35c0 1.04.57 1.6 1.44 2.47l1.96 1.95c1.65 1.65 2.48 2.7 2.48 4.7v.86c0 2.52-1.35 4.25-4.44 4.25-3.13 0-4.35-1.73-4.35-4.12h.04zm9.97 3.9h3.05V8.41h-3.05v18.1zm4.7-4.68v-8.77c0-2.82 1.4-4.86 4.62-4.86 3.26 0 4.65 2.04 4.65 4.86v8.77c0 2.82-1.39 4.9-4.65 4.9-3.22 0-4.62-2.08-4.62-4.9zm6.18.52v-9.77c0-1.08-.43-1.86-1.56-1.86-1.1 0-1.57.78-1.57 1.86v9.77c0 1.08.48 1.86 1.57 1.86 1.08 0 1.56-.78 1.56-1.86zm7.27-7.2V26.5h-2.56V8.41h3l3.3 10.38V8.42h2.58v18.1h-2.7l-3.62-11.38z"/>
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M0 34.72h149.68V.22H.04v34.41l-.04.09zm1.48-1.48h146.76V1.7H1.48v31.55z"/>
            </svg>
            <strong class="u-hiddenVisually">${text`SITE_NAME`}</strong>
          </a>

          <input id="switch" class="Header-switch js-switch" type="checkbox" aria-hidden />
          <label class="Header-toggle" for="switch" aria-hidden touchstart="">
            <svg role="presentation" class="Header-line" viewBox="0 0 24 2"><path fill="currentColor" d="M0 0h24v1.75H0z"/></svg>
            <svg role="presentation" class="Header-line" viewBox="0 0 24 2"><path fill="currentColor" d="M0 0h24v1.75H0z"/></svg>
            ${text`Toggle menu`}
          </label>

          <menu class="Header-menu js-menu">
            <a class="Header-logo" href="/" rel="home" onclick="${close}">
              <svg role="presentation" viewBox="0 0 150 35" width="150" height="35" fill="none">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.57 8.42h8.1v2.47h-2.52v15.62H10.1V10.9H7.57V8.42zm15.16 10.1h-2.97v8h-3.04V8.41h3.04v7.64h2.97V8.42h3.09v18.1h-3.1v-8zm5-10.1h7.32v2.47h-4.27v5.17h3.05v2.47h-3.05v5.51h4.27v2.47h-7.32V8.41zm14.15 6.72v11.37h-2.57V8.41h3l3.27 10.38V8.42h2.57v18.1h-2.7l-3.57-11.38zm8.19-6.72h7.31v2.47h-4.22v5.17h3v2.47h-3v5.51h4.22v2.47h-7.31V8.41zm15.15 6.9l-1.74 11.2H60.6l-2.44-18.1h2.96l1.44 11.45L64.1 8.42h2.52l1.7 11.45 1.4-11.45h2.56l-2.35 18.1h-2.87l-1.83-11.2zm20.55-2.04v8.37c0 2.78-1.14 4.86-4.36 4.86h-4.79V8.41h4.8c3.21 0 4.35 2.05 4.35 4.87zm-4.8 10.76c1.31 0 1.75-.74 1.75-1.87v-9.46c0-1.08-.44-1.82-1.74-1.82h-1.26v13.15h1.3-.04zm6.45 2.47h3.1V8.41h-3.1v18.1zm14.24-18.1l-3.49 18.1h-3.3l-3.44-18.1h3.09l2.09 12.64h.04l2.13-12.63h2.88zm.87 18.1h3.05V8.41h-3.05v18.1zm4.57-3.9v-2.43h2.83v2.52c0 1 .43 1.6 1.48 1.6.96 0 1.4-.65 1.4-1.6V22c0-1.04-.44-1.73-1.36-2.6l-1.78-1.74c-1.74-1.73-2.57-2.78-2.57-4.86v-.65c0-2.21 1.3-3.95 4.31-3.95 3.05 0 4.27 1.48 4.27 4.12v1.44h-2.83v-1.57c0-1.04-.44-1.56-1.44-1.56-.87 0-1.44.48-1.44 1.52v.35c0 1.04.57 1.6 1.44 2.47l1.96 1.95c1.65 1.65 2.48 2.7 2.48 4.7v.86c0 2.52-1.35 4.25-4.44 4.25-3.13 0-4.35-1.73-4.35-4.12h.04zm9.97 3.9h3.05V8.41h-3.05v18.1zm4.7-4.68v-8.77c0-2.82 1.4-4.86 4.62-4.86 3.26 0 4.65 2.04 4.65 4.86v8.77c0 2.82-1.39 4.9-4.65 4.9-3.22 0-4.62-2.08-4.62-4.9zm6.18.52v-9.77c0-1.08-.43-1.86-1.56-1.86-1.1 0-1.57.78-1.57 1.86v9.77c0 1.08.48 1.86 1.57 1.86 1.08 0 1.56-.78 1.56-1.86zm7.27-7.2V26.5h-2.56V8.41h3l3.3 10.38V8.42h2.58v18.1h-2.7l-3.62-11.38z"/>
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M0 34.72h149.68V.22H.04v34.41l-.04.09zm1.48-1.48h146.76V1.7H1.48v31.55z"/>
              </svg>
              <span class="u-hiddenVisually">${text`Home page`}</span>
            </a>
            <ul class="Header-list">
              ${data.header.map(function (item) {
                let children = html`<span class="Header-text">${item.text}</span>`
                if (item.icon) {
                  children = html`${icon(item.icon, { class: 'Header-icon' })} ${children}`
                }
                const href = resolve(item.link)
                const classes = className('Header-item', {
                  'is-current': current === href,
                  'Header-item--icon': item.icon
                })
                return html`<li class="${classes}">${a(item.link, { class: 'Header-link', onclick: close }, children)}</li>`
              }).filter(Boolean)}
            </ul>
          </menu>
        </nav>
        <hr aria-hidden class="u-hiddenVisually">
      </header>
    `
  }
}
