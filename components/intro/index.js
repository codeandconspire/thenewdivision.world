const css = require('sheetify')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Component = require('choo/component')
const asElement = require('prismic-element')
const { Elements } = require('prismic-richtext')
css('./index')

module.exports = class Intro extends Component {
  constructor (id, state, emit, opts = {}) {
    super(id)
    Object.assign(this, opts, {
      finished: true
    })
  }

  load (element) {
    if (this.finished) return

    const self = this
    const groups = [...element.querySelectorAll('.js-group')]
    const children = [...element.childNodes]
    const final = getStrong(this.text)

    element.appendChild(html`<div class="Intro-final">${final}</div>`)

    window.requestAnimationFrame(function () {
      let offset = 0
      groups.reduce(function (prev, group) {
        const index = children.indexOf(group)

        return empty(group).then(() => prev.then(function () {
          const words = children.slice(offset, index)
          const targets = final.splice(0, words.length)

          for (let i = 0, len = words.length, to, from; i < len; i++) {
            from = words[i].getBoundingClientRect()
            to = targets[i].getBoundingClientRect()
            words[i].style.transform = `translate(${to.x - from.x}px, ${to.y - from.y}px)`
          }

          offset = index + 1
        }))
      }, Promise.resolve()).then(function () {
        self.finished = true
        self.rerender()
      })
    })

    // sequentially remove words of group
    // HTMLElement -> Promise
    function empty (group) {
      const queue = []
      const chunks = shuffle([...group.querySelectorAll('.js-chunk')])

      for (let i = 0, len = chunks.length; i < len; i++) {
        queue.push(fadeOut(chunks[i], 225 * i))
      }

      return Promise.all(queue)
    }

    // fade out element
    // (HTMLElement, num) -> Promise
    function fadeOut (el, delay) {
      return new Promise(function (resolve) {
        el.addEventListener('transitionend', resolve)
        window.setTimeout(function () {
          el.classList.add('is-hidden')
        }, delay)
      })
    }
  }

  update (text) {
    return text !== this.text
  }

  createElement (text) {
    this.text = text

    if (this.finished) {
      return html`
        <div class="Intro ${this.static ? 'Intro--static' : ''}">
          <p class="Intro-text">
            ${getStrong(text)}
          </p>
        </div>
      `
    }

    return html`
      <p class="Intro">
        ${asElement(text, fail, serialize)}
      </p>
    `
  }
}

// pluck out only words that are strong
// arr -> arr
function getStrong (text) {
  const spans = text[0].spans.filter((span) => span.type === 'strong')
  const words = spans.reduce(function (str, span) {
    const value = text[0].text.substring(span.start, span.end)
    if (!str) return value
    return str + ' ' + value
  }, '').split(' ')

  return words.reduce((all, word) => all.concat(
    html`<span class="Intro-word js-word">${word}</span>`,
    raw('&nbsp;')
  ), [])
}

// shuffle array in place
// arr -> arr
function shuffle (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = a[i]
    a[i] = a[j]
    a[j] = x
  }

  return a
}

// throw if called
// () -> throw
function fail () {
  throw new Error('home: intro should not include links')
}

// serialize wall of text content
// (obj, str, arr) -> HTMLElement
function serialize (element, content, children) {
  switch (element.type) {
    case Elements.span: {
      const group = []
      const words = content.split(' ')

      for (let i = 0, len = words.length, chunk = []; i < len; i++) {
        chunk.push(words[i])
        if (chunk.length === 3) {
          group.push(chunk.join(' '))
          chunk = []
        }
      }

      return html`
        <span class="Intro-group js-group">
          ${group.map((chunk) => html`
            <span class="Intro-chunk js-chunk">
              ${chunk.split('').map((char) => html`
                <span class="Intro-word js-word">
                  ${char === ' ' ? raw('&nbsp;\n') : char}
                </span>
              `)}
            </span>
          `)}
        </span>
      `
    }
    case Elements.strong: return content.split(' ').map((word) => html`
      <span class="Intro-word">${word + ' '}</span>
    `)
    case Elements.paragraph: return children
    default: return null
  }
}
