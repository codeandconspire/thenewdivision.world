const css = require('sheetify')
const html = require('choo/html')
const nanoraf = require('nanoraf')
const Component = require('choo/component')
css('./index')

module.exports = class Good extends Component {
  constructor (id, state) {
    super(id)
    this.cache = state.cache
  }

  load (element) {
    let top, height
    let inview = false
    const sticky = element.querySelector('.js-sticky')

    const onscroll = nanoraf(function () {
      if ((window.scrollY + window.innerHeight) >= (top + height)) inview = true
      if (window.scrollY > (top + height)) inview = false
      if (!inview) return
      const fraction = (top - window.scrollY) / (window.innerHeight - height)
      element.style.setProperty('--inview', 1 - fraction.toFixed(4))
    })

    const onresize = nanoraf(function () {
      height = sticky.offsetHeight
      top = sticky.offsetTop
      let next = sticky
      while ((next = next.offsetParent)) {
        if (!isNaN(next.offsetTop)) top += next.offsetTop
      }
    })

    onresize()
    onscroll()

    window.addEventListener('scroll', onscroll)
    window.addEventListener('resize', onresize)
    this.unmount = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  update () {
    return false
  }

  createElement (props) {
    return html`
      <div class="Good">
        <div class="Good-sticky js-sticky">
          ${title()}
        </div>
        <div class="Good-row">
          <svg class="Good-heading" width="321" height="655" viewBox="0 0 321 655">
            <g fill="none" fill-rule="evenodd">
              <path fill="#FFF" d="M75 73.3h169.5V140h-23.2v-38.2h-48.5v28.5h-23v-28.5H75V73.3zm169.5 132.2v26.3H116.3C90 231.8 73 220.5 73 191.5c0-30 17-42.5 43.3-42.5h128.2v28.5h-131c-10 0-16.7 4-16.7 14s6.7 14 16.7 14h131zm-23.2 35.8h23.2V317h-23.2v-23.5H75v-28.7h146.3v-23.5zm23.2 142v26.2H116.2C90 409.5 73 398.3 73 369.3c0-30 17-42.5 43.3-42.5h128.2v28.5h-131c-10 0-16.8 4-16.8 14s6.8 14 16.8 14h131zM75 477.5l77.7-26.7H75v-28.6h169.5v41.6c0 28.7-14.3 39.2-38 39.2h-21.8c-18.2 0-29-6.5-32.7-22.7l-77 27.2v-30zm146.2-17.2v-9.6h-52.7v9.6c0 9.7 5 14 14 14h25c9.2 0 13.7-4.3 13.7-14zM75 515h169.5v68h-23.3v-39.5h-48.5v28.3h-23v-28.3H98.2V583H75v-68z"/>
              <path stroke="#FFF" stroke-width="13" d="M314.5 7.5H6.5v641h308V7.5z"/>
            </g>
          </svg>
          <div class="Text">
            <p>${props.future[0].text}</p>
          </div>
        </div>
        <div class="Good-row">
          <svg class="Good-heading" width="321" height="811" viewBox="0 0 321 811">
            <g fill="none" fill-rule="evenodd">
              <path fill="#FFF" d="M75 73.2h169.5v41.3c0 28.5-13.2 38-37.2 38H190c-14.2 0-23.2-5.3-27-17-3.2 14.2-12.7 21.2-28.2 21.2h-22.5c-24 0-37.3-10.7-37.3-39.2V73.2zm76.3 40.8v-12.3h-53v12.5c0 9.5 4.7 14 13.7 14h25.5c9 0 13.8-4.2 13.8-14.2zm70-12.3H173v10c0 9.3 4.8 13.5 13.8 13.5h20.7c9.3 0 13.8-4.2 13.8-13.7v-9.8zM244.5 224v26.2H116.3C90 250.2 73 239 73 210c0-30 17-42.5 43.3-42.5h128.2V196h-131c-10 0-16.7 4-16.7 14s6.7 14 16.7 14h131zM73 301.7c0-29 16.3-40.2 38.5-40.2h22.8V288H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.8l16.8-16.7c16-16.3 25.7-23.8 45.2-23.8h5.8c21 0 37.2 12.3 37.2 40 0 28.5-14 39.8-38.5 39.8h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.2-23 13.5l-18 18.2c-15.7 15.5-25.2 23-44 23h-8.2c-23.3 0-39.8-12.5-39.8-41.5zm2 53h169.5v28.5H75v-28.5zm0 99l106.5-33.5H75v-24h169.5v28L147.3 455h97.2v23.7H75v-25zm0 37.8h169.5v68h-23.2V520h-48.5v28.2h-23V520H98.3v39.5H75v-68zm-2 117.2c0-29 16.3-40.2 38.5-40.2h22.8V595H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.8l16.8-16.7c16-16.3 25.7-23.8 45.2-23.8h5.8c21 0 37.2 12.3 37.2 40 0 28.5-14 39.8-38.5 39.8h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.2-23 13.5l-18 18.2c-15.7 15.5-25.2 23-44 23h-8.2c-23.3 0-39.8-12.5-39.8-41.5zm0 90.5c0-29 16.3-40.2 38.5-40.2h22.8v26.5H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.8l16.8-16.7c16-16.3 25.7-23.8 45.2-23.8h5.8c21 0 37.2 12.3 37.2 40 0 28.5-14 39.8-38.5 39.8h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.2-23 13.5l-18 18.2c-15.7 15.5-25.2 23-44 23h-8.2c-23.3 0-39.8-12.5-39.8-41.5z"/>
              <path stroke="#FFF" stroke-width="13" d="M314.5 7.5H6.5v797h308V7.5z"/>
            </g>
          </svg>
          <div class="Text">
            <p>${props.business[0].text}</p>
          </div>
        </div>
        <div class="Good-row">
          <svg class="Good-heading" width="321" height="769" viewBox="0 0 321 769">
            <g fill="none" fill-rule="evenodd">
              <path fill="#FFF" d="M73 112c0-29 16.3-40.2 38.5-40.2h22.8v26.5H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.8l16.8-16.7C174.3 79.5 184 72 203.5 72h5.8c21 0 37.2 12.3 37.2 40 0 28.5-14 39.8-38.5 39.8h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.2-23 13.5l-18 18.2c-15.7 15.5-25.2 23-44 23h-8.2C89.5 153.5 73 141 73 112zm171.5 135l-105-31.5H75V187h64.5l105-31.7V185l-64.2 17.3v.2l64.2 17.3V247zM73 288.8c0-29 16.3-40.3 38.5-40.3h22.8V275H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.7l16.8-16.8c16-16.2 25.7-23.7 45.2-23.7h5.8c21 0 37.2 12.2 37.2 40 0 28.4-14 39.7-38.5 39.7h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.2-23 13.5l-18 18.2c-15.7 15.6-25.2 23-44 23h-8.2c-23.3 0-39.8-12.4-39.8-41.4zm148.3 46h23.2v75.7h-23.2V387H75v-28.8h146.3v-23.4zM75 420.1h169.5v68h-23.2v-39.4h-48.5V477h-23v-28.2H98.3v39.5H75v-68zm0 158.3h110v-.8L75 558.5v-13.3L185 524v-.5H75V500h169.5v33.3L149 551.8v.2l95.5 16.5v36H75v-26zM73 656c0-29 16.3-40.3 38.5-40.2h22.8v26.5H111c-9.5 0-15 4.2-15 14 0 9 6 13 15 13h6.5c9.8 0 15.8-4 24-12.8l16.8-16.7c16-16.3 25.7-23.8 45.2-23.8h5.8c21 0 37.2 12.3 37.2 40 0 28.5-14 39.8-38.5 39.7h-13.7v-26H209c9.8 0 14.5-4.5 14.5-13.5 0-8-4.5-13.5-14-13.5H206c-9.5 0-15 5.3-23 13.5l-18 18.3c-15.7 15.5-25.2 23-44 23h-8.2C89.5 697.5 73 685 73 656z"/>
              <path stroke="#FFF" stroke-width="13" d="M314.5 7.5H6.5v755h308V7.5z"/>
            </g>
          </svg>
          <div class="Text">
            <p>${props.systems[0].text}</p>
          </div>
        </div>
      </div>
    `
  }
}

function title () {
  return html`
    <svg class="Good-title" width="322" height="523" viewBox="0 0 322 523">
      <g fill="none" fill-rule="evenodd">
        <path fill="#FFF" d="M143.5 115.8H166v40.5H75.5v-20.6H94C81.2 132 73.5 124 73.5 108.5c0-24.5 19.5-35.8 45.7-35.8h82c26.5 0 45.8 12.8 45.8 42.8 0 31.5-17.5 40.8-42.5 40.7h-15v-26h17.2c10.5 0 16.5-4 16.5-14.2 0-10.3-7.2-14.8-17.5-14.8h-91c-10.2 0-17.5 4.3-17.5 14 0 9.3 5.3 14 16.3 14h30v-13.4zM97.2 212c0 10.3 7.3 14.8 17.5 14.8h91c10.3 0 17.5-4.5 17.5-14.8 0-10-7.2-14.5-17.5-14.5h-91c-10.2 0-17.5 4.5-17.5 14.5zm-23.7 0c0-30 19.5-43 45.7-43h82c26.5 0 45.8 13 45.8 43 0 30.3-19.3 43.3-45.8 43.3h-82c-26.2 0-45.7-13-45.7-43.3zm23.7 99c0 10.3 7.3 14.8 17.5 14.8h91c10.3 0 17.5-4.6 17.5-14.8 0-10-7.2-14.5-17.5-14.5h-91c-10.2 0-17.5 4.5-17.5 14.5zm-23.7 0c0-30 19.5-43 45.7-43h82c26.5 0 45.8 13 45.8 43 0 30.3-19.3 43.3-45.8 43.2h-82c-26.2 0-45.7-13-45.7-43.2zm25.2 84.5v12c0 11.8 7 16.3 17.3 16.3h88.7c10 0 17-4.6 17-16.3v-12h-123zM245 411c0 30.5-19.3 41.3-45.5 41.2H121c-26 0-45.5-10.7-45.5-41.2v-44H245v44z"/>
        <path stroke="#FFF" stroke-width="13" d="M315 7v509H7V7z"/>
      </g>
    </svg>
  `
}
