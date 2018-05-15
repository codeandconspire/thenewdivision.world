const html = require('choo/html')
const Component = require('choo/component')

module.exports = class Takeover extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.emit = emit
  }

  static id () {
    return 'takeover'
  }

  update () {
    return false
  }

  open (href, origin, theme = 'white') {
    const self = this
    const el = this.element

    this.emit('ui:partial', href, function (view) {
      const {innerHeight, innerWidth} = window
      const left = origin.left + origin.width / 2
      const top = origin.top + origin.height / 2
      const style = `left: ${left}px; top: ${top}px;`
      const isSlow = (
        (left > innerWidth / 4 && left < innerWidth * 0.8) ||
        (top > innerHeight / 4 && top < innerHeight * 0.8)
      )
      const circle = html`<div class="Takeover-circle ${innerHeight > innerWidth ? 'Takeover-circle--portrait' : ''} ${isSlow ? 'Takeover-circle--slow' : ''}" style="${style}"></div>`

      circle.addEventListener('animationend', function onanimationend () {
        circle.removeEventListener('animationend', onanimationend)
        self.emit('ui:transition', href)
        self.rerender()
        window.removeEventListener('wheel', onscroll)
        window.removeEventListener('touchmove', onscroll)
      })

      window.requestAnimationFrame(function () {
        el.classList.add('is-active')
        el.classList.add(`u-theme${theme[0].toUpperCase() + theme.substr(1)}`)
        el.appendChild(circle)
        el.appendChild(html`<div class="u-relative">${view()}</div>`)
      })

      window.addEventListener('wheel', onscroll)
      window.addEventListener('touchmove', onscroll)

      function onscroll (event) {
        event.preventDefault()
      }
    })
  }

  createElement () {
    return html`<div class="Takeover"></div>`
  }
}
