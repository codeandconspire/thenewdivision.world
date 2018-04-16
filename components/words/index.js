const css = require('sheetify')
const html = require('choo/html')
const nanoraf = require('nanoraf')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const News = require('./news')
require('../base')
css('./index')

module.exports = class Words extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.cache = state.cache
    this.local = state.components[id] = state.components[id] || {
      expanded: []
    }
  }

  update () {
    return false
  }

  load (element) {
    this.reflow()

    let cols = parse()
    let prev = window.innerWidth
    const top = element.offsetTop

    const onscroll = nanoraf(() => {
      const { scrollY, innerHeight } = window

      if (scrollY + innerHeight < top) return

      for (let i = 1, len = cols.length, col; i < len; i++) {
        col = cols[i]
        if (innerHeight > col.height) continue
        if (scrollY + innerHeight > top + col.height) continue
        const inview = scrollY + innerHeight - top
        col.el.style.setProperty('--offset', `${((inview / col.height) * col.overflow * -1).toFixed(2)}px`)
      }
    })

    const onresize = nanoraf(() => {
      const next = window.innerWidth
      if ((prev >= 1000 && next < 1000) || (prev < 1000 && next >= 1000)) {
        this.rerender()
        this.reflow()
        cols = parse()
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

    function parse () {
      return [...element.querySelectorAll('.js-col')].map((el, i, list) => {
        const height = el.offsetHeight
        const overflow = height - list[0].offsetHeight
        return { el, height, overflow }
      })
    }
  }

  reflow () {
    const last = []
    const cols = this.element.querySelectorAll('.js-col')
    const fraction = Math.floor(cols[0].childElementCount * 0.25) || 1

    for (let i = 0, len = cols.length; i < len; i++) {
      last.push(...Array.prototype.slice.call(cols[i].childNodes, fraction * -1))
    }

    for (let i = 0, len = last.length; i < len; i++) {
      if (i < Math.floor(len / 3)) {
        cols[2 % cols.length].appendChild(last[i])
      } else {
        cols[1].appendChild(last[i])
      }
    }
  }

  createElement (slices) {
    this.slices = slices

    const cols = [[], []]
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
          <div class="Words-col js-col">
            ${cells.map((slice, cell) => {
              const props = slice.primary
              switch (slice.slice_type) {
                case 'news': return this.cache(News, `${News.id(props)}-${col}:${cell}`).render(props)
                case 'quote': return html`
                  <article class="Words-cell js-cell">
                    <h3 class="Display Display--3">${asText(props.text)}</h3>
                  </article>
                `
                case 'tweet': return null
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
