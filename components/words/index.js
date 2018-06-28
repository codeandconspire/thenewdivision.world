const html = require('choo/html')
const nanoraf = require('nanoraf')
const Component = require('choo/component')
const { asText } = require('prismic-richtext')
const News = require('./news')

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

    let cols = measure()
    let prev = window.innerWidth
    const top = element.offsetTop

    let above = false
    let below = false
    const onscroll = nanoraf(() => {
      const { scrollY } = window

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
          const inview = scrollY - top
          const fraction = inview / col.height
          col.el.style.setProperty('--offset', fraction.toFixed(6))
          above = below = false
        }
      }
    })

    const onresize = nanoraf(() => {
      const next = window.innerWidth
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

  reflow () {
    const last = []
    const cols = [...this.element.querySelectorAll('.js-col')]

    for (let i = 0, len = cols.length, col; i < len; i++) {
      col = cols[i]
      last.push(...Array.prototype.slice.call(col.childNodes, -2))
      if (col.childElementCount) col.removeChild(col.lastElementChild)
      if (col.childElementCount) col.removeChild(col.lastElementChild)
    }

    for (let i = 0, len = last.length; i < len; i++) {
      const shortest = cols.reduce((min, el) => {
        const height = el.offsetHeight
        return !min || height < min.height ? {el, height} : min
      }, null)
      shortest.el.appendChild(last[i])
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
          <div class="Words-col Words-col--${col + 1} js-col">
            ${cells.map((slice, cell) => {
              const props = slice.primary
              switch (slice.slice_type) {
                case 'news': return this.cache(News, `${this.id}-${News.id(props)}-${col}:${cell}`).render(props)
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
