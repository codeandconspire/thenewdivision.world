var assert = require('assert')
var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var {offset, vh, modulate, supports} = require('../base')

var BRANCHES = [
  // [[pathX, pathY], pathLine, branchTranslate, numberX, titleX, rotationAxisOffset, title, descriptionId]
  [[702.6, 288.8], 'l172.6.2', '701.4 232.68', 0, 31.7, 0.1, 'Awareness', 'awareness_description'],
  [[932.9, 385], 'h195.6', '931.87 328.85', 0, 34.6, -0.3, 'Relationship', 'relationship_description'],
  [[1073.7, 582.2], 'l219.2.1', '1072.45 526.24', 0, 36.4, 1, 'Business Case', 'business_case_description'],
  [[1071.6, 824.6], 'l149.2-.1', '1071.44 768.27', 1, 38.3, 1, 'Strategy', 'strategy_description'],
  [[927.3, 1019.1], 'l137.5-.1', '926.57 962.77', 4, 40.6, 0, 'Culture', 'culture_description'],
  [[696.87, 1092.3], 'l142.6-.2', '696.6 1036.17', 10, 49.1, 0, 'Design', 'design_description'],
  [[467.1, 1015.4], 'l244.8-.2', '466.73 959.23', 6, 39.4, -0.1, 'Communication', 'communication_description'],
  [[326.3, 818.4], 'l175-.2', '325.86 762.29', 6, 41.3, -0.1, 'Activation', 'activation_description'],
  [[328.2, 575.6], 'l174.9.1', '327.5 519.61', 4, 40.1, 0.05, 'Evaluation', 'evaluation_description'],
  [[472.1, 381.2], 'l159.2-.2', '471.24 324.99', 8, 39.7, -0.21, 'Evolution', 'evolution_description']
]

module.exports = class Wheel extends Component {
  constructor (id) {
    super(id)
    this.branches = []
    this.hasSticky = typeof window === 'undefined' || supports('position: sticky')
  }

  load (element) {
    var top, height, isSticky
    var anchors = element.querySelector('.js-anchors').childNodes

    var onscroll = nanoraf(() => {
      var viewport = vh()
      var {scrollY} = window
      if (scrollY > top + height || scrollY + viewport < top) {
        return
      }

      if (!this.hasSticky) {
        if (scrollY + viewport <= top + height && scrollY >= top) {
          if (!isSticky) {
            isSticky = true
            element.classList.add('is-sticky')
            element.classList.remove('is-bottom')
          }
        } else if (isSticky) {
          isSticky = false
          element.classList.remove('is-sticky')
          if (scrollY + viewport >= top + height) {
            element.classList.add('is-bottom')
          }
        }
      }

      var progress = (scrollY - top) / height
      element.style.setProperty('--progress', progress.toFixed(5))

      for (let i = 0, len = this.branches.length; i < len; i++) {
        let [ [x, y], , , , , offset, , ] = this.branches[i][1]
        let el = this.branches[i][0]

        if (i + 2 < progress * 10 || i - 3 > progress * 10) {
          anchors[i].style.setProperty('visibility', 'hidden')
          el.style.setProperty('visibility', 'hidden')
          continue
        }

        el.style.removeProperty('visibility')
        anchors[i].style.removeProperty('visibility')

        // figure out each slices position (deg)
        let position = (progress * 360 + 72) - ((i + 1) * 36)
        // convert where slice is in view (between -35° and 72°) to decimals
        let inview = (position - -35) / (72 - -35)

        let visible
        if (inview > 0.3 && inview < 0.8) {
          if (inview < 0.4) visible = modulate(inview, [0.3, 0.4], [0, 1])
          else if (inview > 0.7) visible = modulate(inview, [0.8, 0.7], [0, 1])
          else visible = 1
        } else {
          visible = 0
        }
        el.style.setProperty('--part-progress', visible.toFixed(2))

        let value = `rotate(${360 * progress - 72}, ${x}, ${y + offset})`
        el.setAttribute('transform', value)
      }
    })

    var onresize = nanoraf(function onresize () {
      height = element.offsetHeight
      top = offset(element)
    })

    window.addEventListener('scroll', onscroll, {passive: true})
    window.addEventListener('resize', onresize)
    this.unload = unload

    onresize()
    onscroll()

    function unload () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  update () {
    return false
  }

  createElement (doc) {
    assert(typeof doc === 'object', 'wheel: doc should be an object')

    var self = this

    return html`
      <div class="Wheel ${this.hasSticky ? '' : 'has-fallback'}">
        <ol class="Wheel-list">
          ${BRANCHES.map((props, index) => html`
            <li class="Wheel-item">
              <h3 class="Wheel-title">
                <span class="Wheel-number">${('0' + (index + 1)).substr(-2)}</span>
                ${props[6]}
              </h3>
              <p class="Wheel-text">${doc.data[props[7]][0].text.replace('\n', ' ')}</p>
            </li>
          `)}
        </ol>
        <div class="Wheel-container">
          <svg class="Wheel-graphic" width="1400" height="1400" viewBox="0 0 1400 1400">
            <g fill="none" fill-rule="evenodd">
              <g stroke="#FFF" stroke-width="3" class="js-anchors">
                <path d="M702.7 405.5V288.9"/>
                <path d="M875.1 463.2l58.15-78.25"/>
                <path d="M980.97 611.5l92.91-29.3"/>
                <path d="M979.3 793.6l92.37 31"/>
                <path d="M870.9 939.9l56.52 79.39"/>
                <path d="M697.66 994.5l-.8 97.49"/>
                <path d="M525.1 936.8l-58.06 78.47"/>
                <path d="M419.1 788.7l-92.88 29.42"/>
                <path d="M420.6 606.7l-92.38-30.96"/>
                <path d="M528.9 460.3l-56.6-79.38"/>
              </g>
              ${BRANCHES.map(branch)}
              <path stroke="#FFF" stroke-dasharray="174.27 18" stroke-width="23" d="M716.548 1005.552c168.752-9.14 298.143-153.348 289.004-322.1-9.14-168.752-153.348-298.143-322.1-289.004-168.752 9.14-298.143 153.348-289.004 322.1 9.14 168.752 153.348 298.143 322.1 289.004z"/>
            </g>
          </svg>
        </div>
      </div>
    `

    // create and cache wheel branch from props
    // (arr, num) -> HTMLElement
    function branch (props, index) {
      var [coordinates, line, translate, numX, titleX, , title, descriptionId] = props
      var d = 'M' + coordinates.join(' ') + line

      var el
      if (self.element) {
        el = html`<g></g>`
        el.isSameNode = (node) => node.getAttribute('d') === d
        return el
      }

      el = html`
        <g>
          <path stroke="#FFF" stroke-width="3" d="${d}"/>
          <circle r="1.4" fill="#FFF" cx="${coordinates[0]}" cy="${coordinates[1]}"/>
          <g transform="translate(${translate})">
            <text fill="#FFF">
              <tspan x="${numX}" y="42" class="Wheel-title Wheel-title--number">${('0' + (index + 1)).substr(-2)}</tspan>
            </text>
            <text fill="#1D1D1B">
              <tspan x="${titleX}" y="42" class="Wheel-title">${title}</tspan>
            </text>
            <text fill="#FFF">
              ${doc.data[descriptionId][0].text.split('\n').map((line, index) => html`
                <tspan x="0" y="${88 + index * 16}" class="Wheel-text">${line}</tspan>
              `)}
            </text>
          </g>
        </g>
      `

      self.branches[index] = [el, props]
      return el
    }
  }
}
