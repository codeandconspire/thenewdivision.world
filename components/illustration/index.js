const html = require('choo/html')
const nanoraf = require('nanoraf')
const Component = require('choo/component')
const { vh } = require('../base')

module.exports = class Illustration extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  update () {
    return false
  }

  load (element) {
    let inview
    let offset, height, viewport
    const onscroll = nanoraf(function () {
      const { scrollY } = window
      if (scrollY > (offset - (viewport / 4))) {
        if (inview) element.style.setProperty('--Illustration-offset', 1)
        return
      }
      if (scrollY + viewport < (offset + (viewport / 4))) {
        if (inview) element.style.setProperty('--Illustration-offset', 0)
        return
      }
      const ratio = 1 - (((offset - (viewport / 4)) - scrollY) / (viewport - (viewport / 2)))
      element.style.setProperty('--Illustration-offset', ratio.toFixed(3))
      inview = true
    })

    const onresize = nanoraf(function () {
      height = element.offsetHeight
      offset = element.offsetTop
      viewport = vh()
      let parent = element
      while ((parent = parent.offsetParent)) offset += parent.offsetTop
      onscroll()
    })

    onresize()
    onscroll()
    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll, { passive: true })
    return function () {
      window.removeEventListener('resize', onscroll)
      window.removeEventListener('scroll', onscroll)
    }
  }

  createElement (version) {
    return html`
      <div class="Illustration Illustration--${version}">
        ${version ? html`
          <div class="Illustration-planet js-planet">
            <svg class="Illustration-lines" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g transform="translate(29.33 26.46)"><g stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width=".8"><path d="m403.36 40.6-164.31-26.58-148.71 76.08-76.32 149.69 25.22 166.12 117.13 119.1 164.31 26.59 148.71-76.09 76.33-149.69-25.23-166.12z"/><path d="m156.37 525.01 246.99-484.41-82.68 511"/><path d="m469.39 475.51-66.03-434.91 142.36 285.22"/><path d="m39.24 405.91 364.12-365.31-389.34 199.19"/><path d="m90.34 90.1 313.02-49.5"/><path d="m320.68 551.6-81.63-537.58 230.34 461.49"/><path d="m545.72 325.82-306.67-311.8 281.44 145.68"/><path d="m156.37 525.01 82.68-510.99-199.81 391.89"/><path d="m14.02 239.79 225.03-225.77"/><path d="m469.39 475.51-379.05-385.41 455.38 235.72"/><path d="m520.49 159.7-430.15-69.6"/><path d="m320.68 551.6-230.34-461.5 66.03 434.91"/><path d="m39.24 405.91 51.1-315.81"/><path d="m545.72 325.82-531.7-86.03 506.47-80.09"/><path d="m469.39 475.51-455.37-235.72 306.66 311.81"/><path d="m156.37 525.01-142.35-285.22"/><path d="m520.49 159.7-481.25 246.21"/><path d="m545.72 325.82-506.48 80.09 430.15 69.6"/><path d="m320.68 551.6-281.44-145.69"/><path d="m520.49 159.7-364.12 365.31 389.35-199.19"/><path d="m469.39 475.51-313.02 49.5"/><path d="m320.68 551.6 199.81-391.9-51.1 315.81"/><path d="m545.72 325.82-225.04 225.78"/><path d="m187.96 329.79 76.41-150.05"/><path d="m390.7 259.8-34.64-126.57"/><path d="m390.87 259.66 37.79-52.73"/><path d="m390.94 260.08 154.57 66.02"/><path d="m115.68 256.35 72.2 73.47-43.05-130.65"/><path d="m279.59 282.65 111.28-22.78 14.59 87.77"/><path d="m356.06 133.35-92.35 46.84"/></g><circle cx="239.05" cy="14.02" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="403.36" cy="40.6" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="520.49" cy="159.7" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="545.72" cy="325.82" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="469.39" cy="475.51" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="320.68" cy="551.6" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="156.37" cy="525.01" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="39.24" cy="405.91" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="14.02" cy="239.79" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="90.34" cy="90.1" fill="#646464" fill-rule="nonzero" opacity=".5" r="14.02"/><circle cx="115.68" cy="256.35" fill="#afafaf" fill-rule="nonzero" r="2.8"/><circle cx="131.46" cy="358.83" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="204.02" cy="432.31" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="361.77" cy="419.73" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="428.66" cy="206.93" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="352.13" cy="356.38" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="405.84" cy="347.87" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="144.92" cy="199.4" fill="#afafaf" fill-rule="nonzero" r="1.95"/><circle cx="144.83" cy="199.29" fill="#646464" fill-rule="nonzero" opacity=".5" r="5.18"/><circle cx="187.8" cy="330.25" fill="#646464" fill-rule="nonzero" opacity=".5" r="8.93"/><circle cx="263.71" cy="180.19" fill="#646464" fill-rule="nonzero" opacity=".5" r="8.93"/><circle cx="361.77" cy="418.96" fill="#646464" fill-rule="nonzero" opacity=".5" r="16.21"/><circle cx="390.87" cy="259.87" fill="#646464" fill-rule="nonzero" opacity=".5" r="11.27"/><circle cx="356.06" cy="133.35" fill="#646464" fill-rule="nonzero" opacity=".5" r="6.3"/><circle cx="203.89" cy="432.31" fill="#646464" fill-rule="nonzero" opacity=".5" r="18.32"/><circle cx="405.46" cy="347.64" fill="#646464" fill-rule="nonzero" opacity=".5" r="6.93"/><circle cx="428.24" cy="207.54" fill="#646464" fill-rule="nonzero" opacity=".5" r="11.26"/><circle cx="115.68" cy="256.35" fill="#646464" fill-rule="nonzero" opacity=".5" r="10.17"/><circle cx="86.38" cy="313.9" fill="#646464" fill-rule="nonzero" opacity=".5" r="5.72"/></g></g>
            </svg>
            <svg class="Illustration-dots" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g fill-rule="nonzero"><circle cx="268.38" cy="40.48" fill="#fff" r="5.16"/><circle cx="432.69" cy="67.06" fill="#fff" r="5.16"/><circle cx="549.82" cy="186.16" fill="#fff" r="5.16"/><circle cx="575.05" cy="352.28" fill="#fff" r="5.16"/><circle cx="498.72" cy="501.97" fill="#fff" r="5.16"/><circle cx="350.01" cy="578.06" fill="#fff" r="5.16"/><circle cx="185.7" cy="551.47" fill="#fff" r="5.16"/><circle cx="68.57" cy="432.37" fill="#fff" r="5.16"/><circle cx="119.67" cy="116.56" fill="#fff" r="5.16"/><circle cx="145.01" cy="282.81" fill="#afafaf" r="2.8"/><circle cx="233.35" cy="458.77" fill="#afafaf" r="1.95"/><circle cx="391.1" cy="446.19" fill="#afafaf" r="1.95"/><circle cx="457.99" cy="233.39" fill="#afafaf" r="1.95"/><circle cx="435.17" cy="374.33" fill="#afafaf" r="1.95"/><circle cx="174.25" cy="225.86" fill="#afafaf" r="1.95"/><g fill="#fff"><circle cx="309.26" cy="309.28" r="14.02"/><circle cx="174.16" cy="225.75" r="2.18"/><circle cx="217.13" cy="356.71" r="3.76"/><circle cx="293.04" cy="206.65" r="3.76"/><circle cx="391.1" cy="445.42" r="6.82"/><circle cx="420.2" cy="286.33" r="4.15"/><circle cx="385.39" cy="159.81" r="2.32"/><circle cx="233.22" cy="458.77" r="6.75"/><circle cx="434.79" cy="374.1" r="2.55"/><circle cx="457.57" cy="234" r="4.15"/><circle cx="145.01" cy="282.81" r="3.75"/><circle cx="115.71" cy="340.36" r="2.11"/><circle cx="43.35" cy="266.25" r="5.16"/></g></g></g>
            </svg>
          </div>
        ` : null}
      </div>
    `
  }
}
