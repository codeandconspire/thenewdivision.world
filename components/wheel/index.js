var assert = require('assert')
var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var {offset, vh, modulate, supports} = require('../base')

var BRANCHES = [
  // [[pathX, pathY], pathLine, branchTranslate, titleX, rotationAxisOffset, number, title, descriptionId]
  [[701, 304.8], 'l172.6.2', '699.8 248.68', 32.7, 0.2, '01', 'Awareness', 'awareness_description'],
  [[942.3, 409.4], 'l181-.2', '941.27 353.25', 36.6, 0.3, '02', 'Relationship', 'impact_description'],
  [[1063.6, 588.1], 'l219.2.1', '1062.35 532.14', 37.4, 1, '03', 'Business Case', 'business_case_description'],
  [[1065.8, 852.6], 'l149.2-.1', '1066.64 796.27', 38.3, 1, '04', 'Strategy', 'strategy_description'],
  [[920, 1030.3], 'l137.5-.1', '925.27 973.97', 37.6, 0, '05', 'Culture', 'culture_description'],
  [[692.3, 1118.3], 'l142.6-.2', '706.03 1062.17', 38.1, -0.5, '06', 'Design', 'design_description'],
  [[471.4, 1018.4], 'l244.8-.2', '485.03 962.23', 35.4, -0.55, '07', 'Communication', 'communication_description'],
  [[346.9, 826.6], 'l175-.2', '352.46 770.5', 38.3, -0.4, '08', 'Activation', 'activation_description'],
  [[322.6, 581.5], 'l174.9.1', '325.9 525.5', 38.1, 0.15, '09', 'Evaluation', 'evaluation_description'],
  [[465.3, 383.2], 'l159.2-.2', '471.44 326.99', 32.7, -0.21, '10', 'Evolution', 'evolution_description']
]

module.exports = class Wheel extends Component {
  constructor (id) {
    super(id)
    this.branches = []
  }

  load (element) {
    if (!supports('position: sticky')) return

    var top, height
    var anchors = element.querySelector('.js-anchors').childNodes

    var onscroll = nanoraf(() => {
      var viewport = vh()
      var {scrollY} = window
      if (scrollY > top + height) return
      if (scrollY + viewport < top) return

      var progress = (scrollY - top) / height
      element.style.setProperty('--progress', progress.toFixed(5))

      for (let i = 0, len = this.branches.length; i < len; i++) {
        let [ [x, y], , , , offset, , ] = this.branches[i][1]
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

        // el.style.setProperty('--part-inview', 1 : 0)
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
      <div class="Wheel">
        <div class="Wheel-container">
          <svg class="Wheel-graphic" width="1400" height="1400" viewBox="0 0 1400 1400">
            <g fill="none" fill-rule="evenodd">
              <g stroke="#FFF" stroke-width="23">
                <path d="M871.4 464.8c-48.9-34-108.2-54.1-172.1-54.5"/>
                <path d="M978.3 596.1a306.02 306.02 0 0 0-91.5-119.9"/>
                <path d="M990.1 802.4c8.1-27.5 12.5-56.6 12.5-86.7 0-35.6-6.1-69.8-17.3-101.5"/>
                <path d="M889.6 952.9c42.4-34.4 75.4-80 94.5-132.2"/>
                <path d="M713.3 1020.7c59.6-3.1 114.8-23.3 160.5-55.8"/>
                <path d="M530.4 971.6a303.27 303.27 0 0 0 163.5 49.5"/>
                <path d="M412.2 825.7a306.41 306.41 0 0 0 102.5 134.9"/>
                <path d="M403.4 632.1c-7.5 26.6-11.6 54.6-11.6 83.6 0 32 4.9 62.9 14.1 92"/>
                <path d="M504.4 478.9c-43 35.1-76.4 81.7-95.2 135.1"/>
                <path d="M679.6 410.8c-59 3.3-113.6 23.5-159 55.7"/>
              </g>
              <g stroke="#FFF" stroke-width="3" class="js-anchors">
                <path d="M700.7 421.8l.3-117"/>
                <path d="M880.7 486.1l61.6-76.7"/>
                <path d="M975.3 619.4l88.3-31.3"/>
                <path d="M973.4 818.3l92.4 34.3"/>
                <path d="M865.9 956.9l54.1 73.4"/>
                <path d="M692.4 1010l-.7 108.3"/>
                <path d="M520 950.8l-49.8 67.6"/>
                <path d="M416 802.3l-71.1 24.3"/>
                <path d="M419.6 616.2l-98.1-34.7"/>
                <path d="M528 475.5l-62.5-92.3"/>
              </g>
              ${BRANCHES.map(branch)}
            </g>
          </svg>
        </div>
      </div>
    `

    // create and cache wheel branch from props
    // (arr, num) -> HTMLElement
    function branch (props, index) {
      var [coordinates, line, translate, x, , num, title, descriptionId] = props
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
              <tspan x="0" y="42" class="Wheel-title Wheel-title--number">${num}</tspan>
            </text>
            <text fill="#1D1D1B">
              <tspan x="${x}" y="42" class="Wheel-title">${title}</tspan>
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

function checkSticky () {
  var computedPseudoStyle = window.getComputedStyle(element, ':before')
  var pseudoContent = computedPseudoStyle.getPropertyValue('content')
  var hasSticky = pseudoContent.indexOf('sticky') !== -1
}
