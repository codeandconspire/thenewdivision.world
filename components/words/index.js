var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var asElement = require('prismic-element')
var {asText, Elements} = require('prismic-richtext')
var button = require('../button')
var Figure = require('../figure')
var {i18n} = require('../base')
var icon = require('../icon')
var News = require('./news')

var text = i18n(require('./lang.json'))

module.exports = class Words extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.cache = state.cache
    this.local = state.components[id] = {
      expanded: []
    }
  }

  update () {
    return false
  }

  load (element) {
    this.reflow()

    var cols = measure()
    var prev = window.innerWidth
    var top = element.offsetTop

    var above = false
    var below = false
    var onscroll = nanoraf(() => {
      var {scrollY} = window

      if (scrollY < top && above) return

      for (let i = 1, len = cols.length, col; i < len; i++) {
        col = cols[i]
        if (scrollY < top) {
          col.el.style.setProperty('--offset', 0)
          above = true
          below = false
        } else if (scrollY > top + col.height) {
          if (below) {
            continue
          } else {
            col.el.style.setProperty('--offset', 1)
            above = false
            below = true
          }
        } else {
          let inview = scrollY - top
          let fraction = inview / col.height
          col.el.style.setProperty('--offset', fraction.toFixed(6))
          above = below = false
        }
      }
    })

    var onresize = nanoraf(() => {
      var next = window.innerWidth
      if ((prev >= 1000 && next < 1000) || (prev < 1000 && next >= 1000)) {
        this.rerender()
        this.reflow()
        cols = measure()
        onscroll()
      }
      prev = next
    })

    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll)
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }

    function measure () {
      return [...element.querySelectorAll('.js-col')].map((el, i, list) => ({
        el: el,
        height: el.offsetHeight
      }))
    }
  }

  // redistribute column items to get equal height(-ish) cols
  // () -> void
  reflow () {
    var last = []
    var cols = [...this.element.querySelectorAll('.js-col')]

    for (let i = 0, len = cols.length, col; i < len; i++) {
      col = cols[i]
      last.push(...Array.prototype.slice.call(col.childNodes, -2))
      if (col.childElementCount) col.removeChild(col.lastElementChild)
      if (col.childElementCount) col.removeChild(col.lastElementChild)
    }

    for (let i = 0, len = last.length; i < len; i++) {
      var shortest = cols.reduce((min, el) => {
        var height = el.offsetHeight
        return !min || height < min.height ? {el, height} : min
      }, null)
      shortest.el.appendChild(last[i])
    }
  }

  createElement (slices) {
    this.slices = slices

    var cols = [[], []]
    if (typeof window !== 'undefined' && window.innerWidth >= 1000) {
      cols.push([])
    }

    for (let i = 0, len = slices.length, col = 0; i < len; i++) {
      cols[col].push(slices[i])
      if (col === cols.length - 1) col = 0
      else col += 1
    }

    return html`
      <div class="Words">
        ${cols.map((cells, col) => html`
          <div class="Words-col Words-col--${col + 1} js-col">
            ${cells.map((slice, cell) => {
              var props = slice.primary
              switch (slice.slice_type) {
                case 'news': return this.cache(News, `${this.id}-${News.id(props)}-${col}:${cell}`).render(props)
                case 'quote': return html`
                  <article class="Words-cell js-cell">
                    <h3 class="Display Display--3">${asText(props.text)}</h3>
                  </article>
                `
                case 'tweet': {
                  var [, type, value] = props.link.url.match(/twitter\.com\/(\w+)\/(\w+)/)
                  return html`
                    <article class="Words-cell Button-wrapper js-cell" id="${this.id}">
                      ${props.image.url ? this.cache(Figure, `${this.id}-${Figure.id(props.image)}`, {sizes: [[`${100 / 3}vw`, 1000], ['50vw']]}).render(props.image) : null}
                      <div href="${props.link.url}" class="Text Text--full u-textSizeSm ${props.image.url ? 'u-spaceT2' : ''}">
                        <div class="Words-icon">${icon.twitter({brand: true})}</div>
                        ${type ? html`
                          <p class="u-spaceB0 ${props.image.url ? '' : 'u-spaceT0'}">
                            <strong>${type === 'hashtag' ? `#${value}` : `@${type}`}</strong>
                          </p>
                        ` : null}
                        ${asElement(props.tweet, resolveDoc, serializeTweet)}
                      </div>
                      ${button(text`More tweets`, {href: props.link.url, target: props.link.target, wrap: true})}
                    </article>
                  `
                }
                case 'medium': return null
                default: return null
              }
            })}
          </div>
        `)}
      </div>
    `
  }
}

// hyperlink hashtags and mentions in tweet text
// (obj, str, arr) -> any
function serializeTweet (type, node, content, children) {
  switch (type) {
    case Elements.span: return content.split(/((?:@|#)\w+)/g).map(hyperlink)
    case Elements.hyperlink: {
      let attrs = {
        href: node.data.url,
        className: 'u-zBump u-textWordBreak'
      }

      if (node.data.target === '_blank') {
        attrs.target = '_blank'
        attrs.rel = 'noopener noreferrer'
      }

      return html` <a ${attrs}> ${children} </a> `
    }
    case Elements.paragraph: return html`<p class="u-spaceT0">${children}</p>`
    default: return null
  }
}

// replacer for matched linkable props in tweet text
// (str, ...str) -> str
function hyperlink (part) {
  if (!/^@|#/.test(part)) return part
  var [, type, value] = part.split(/(@|#)(\w+)/)
  switch (type) {
    case '#': return html`
      <a class="u-zBump" target="_blank" rel="noopener noreferrer" href="https://mobile.twitter.com/hashtag/${value}">#${value}</a>
    `
    case '@': return html`
      <a class="u-zBump" target="_blank" rel="noopener noreferrer" href="https://mobile.twitter.com/${value}">@${value}</a>
    `
    default: return value
  }
}

// resolve document preview url
// obj -> str
function resolveDoc (doc) {
  switch (doc.type) {
    case 'homepage': return '/'
    case 'about': return '/about'
    case 'case': return `/${doc.uid}`
    default: throw new Error(`Could not resolve url to document ${doc.id}`)
  }
}
