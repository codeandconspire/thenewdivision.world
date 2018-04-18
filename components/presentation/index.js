const css = require('sheetify')
const html = require('choo/html')
const Component = require('choo/component')
const { i18n } = require('../base')
css('./index')

const SIZE = 167 + 374 + 285 + 376

const text = i18n(require('./lang.json'))

module.exports = class Presentation extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
    if (!this.static) this.load = this.done
  }

  done (element) {
    let i = 0
    const onanimationend = () => {
      if (i++ < 3) return
      element.removeEventListener('animationend', onanimationend)
      this.static = true
      this.rerender()
    }
    element.addEventListener('animationend', onanimationend)
  }

  update () {
    return false
  }

  createElement (texts) {
    return html`
      <div class="Presentation ${this.static ? 'Presentation--static' : ''}" id="presentation">
        <div class="Presentation-col" style="flex-basis: ${((167 / SIZE) * 100).toFixed(2)}%">
          <svg class="Presentation-title" width="167" height="131" viewBox="0 0 167 131">
            <path fill="#FFF" fill-rule="evenodd" d="M50.7 49.4h-.2L38.3 129H18L.7.2h21l10 81.7h.2L42.7.2h17.7l12 81.7h.1L82.5.2h18.2L83.9 129H63.4L50.7 49.4zm96.5 37h19.7v12.8c0 19.3-9.1 31.3-29.8 31.3-21 0-31-13.5-31-32.7V52.4c0-19.4 10-32.6 31-32.6 20.7 0 29.8 12 29.8 31.3v26H127v24c0 7.4 3.4 12.1 10.5 12.1 6.8 0 9.7-4.5 9.7-12.1V86.4zM127 49.2v12.7h19.8V49.2c0-7.4-2.9-12.2-9.7-12.2-7 0-10 4.8-10 12.2z"/>
          </svg>
          <div class="Presentation-text">
            ${texts[0]}
            <a class="Presentation-link" onclick=${scrollIntoView} href="#about-us">${text`About us`}</a>
          </div>
        </div>
        <div class="Presentation-col" style="flex-basis: ${((374 / SIZE) * 100).toFixed(2)}%">
          <svg class="Presentation-title" width="374" height="133" viewBox="0 0 374 133">
            <path fill="#FFF" fill-rule="evenodd" d="M33 132.5C10.3 132.5.8 117.7.8 97.7V35.5C.8 15.3 10.3.7 33.1.7 57 .7 63.6 14 63.6 33v15.2H44v-17c0-8-2.7-12.5-10.5-12.5s-11 5.5-11 13.3v69.2c0 7.8 3.2 13.3 11 13.3s10.5-5 10.5-12.6V78.2h19.7v22.2c0 18.4-7.6 32.1-30.5 32.1zm80.4-110V47h-6c-7.4 0-10.6 3.6-10.6 11v73h-21V23.3h21v11h.3c1.7-5 6.1-11.4 16.4-11.8zm50 66h19.8v12.7c0 19.3-9 31.3-29.8 31.3-20.9 0-31-13.5-31-32.7V54.4c0-19.3 10.1-32.6 31-32.6 20.7 0 29.8 12 29.8 31.3v26h-39.9v24c0 7.4 3.5 12.1 10.5 12.1 6.8 0 9.7-4.5 9.7-12.1V88.4zm-20-37.3v12.7H163V51.2c0-7.4-2.8-12.2-9.7-12.2-7 0-10 4.8-10 12.2zM253.8 131h-21v-9h-.5c-2.7 4.4-7.4 10.5-17 10.5-14.7 0-22.1-8.3-22.1-27.1v-8.2c0-17.9 10.4-23 24.7-29.3 12.7-5.5 15-8 15-13v-5c0-7.6-2.1-10.9-8.4-10.9-6.6 0-9.3 3.6-9.3 11v10.7h-19v-9.1c0-18 7.8-29.9 29-29.9C246 21.8 254 32.5 254 52v79zm-30.6-15.2c7.6 0 9.7-4.8 9.7-11.4V76.9a36.6 36.6 0 0 1-10.5 6.6c-6.4 3.8-8.3 6.5-8.3 14.3v6.6c0 6.6 1.9 11.4 9 11.4zm39.3-76.6v-16h7.8v-21H291v21h13v16h-13v69c0 4.4 1.7 5.9 6.4 5.9h6.7V131h-9c-18.8 0-24.8-6.6-24.8-24V39.3h-7.8zm91.1 49.2h19.8v12.8c0 19.3-9.1 31.3-29.8 31.3-21 0-31-13.5-31-32.7V54.4c0-19.3 10-32.6 31-32.6 20.7 0 29.8 12 29.8 31.3v26h-40v24c0 7.4 3.5 12.1 10.5 12.1 6.9 0 9.7-4.5 9.7-12.1V88.4zm-20.1-37.2v12.7h19.7V51.2c0-7.4-2.8-12.2-9.6-12.2-7 0-10.1 4.8-10.1 12.2z"/>
          </svg>
          <div class="Presentation-text">
            ${texts[1]}
            <a class="Presentation-link" onclick=${scrollIntoView} href="#our-services">${text`Our services`}</a>
          </div>
        </div>
        <div class="Presentation-col" style="flex-basis: ${((285 / SIZE) * 100).toFixed(2)}%">
          <svg class="Presentation-title" width="285" height="133" viewBox="0 0 285 133">
            <path fill="#FFF" fill-rule="evenodd" d="M33.4 79.3v-17h30.8V131H48.6v-14c-2.8 9.6-8.9 15.5-20.7 15.5C9.3 132.5.8 117.7.8 97.7V35.5C.8 15.3 10.3.7 33.1.7c24 0 31 13.3 31 32.3v11.4H44.5V31.3c0-8-3-12.6-10.9-12.6-7.8 0-11.2 5.5-11.2 13.3v69.2c0 7.8 3.2 13.3 10.6 13.3 7 0 10.7-4 10.7-12.4V79.3H33.4zm74 53.2c-20.8 0-30.9-13.5-30.9-32.7V54.4c0-19.4 10-32.6 31-32.6 20.7 0 30.8 13.2 30.8 32.6v45.4c0 19.2-10.1 32.7-30.8 32.7zm0-17.3c7 0 10-4.7 10-12.1V51.2c0-7.4-3-12.2-10-12.2s-10 4.8-10 12.2v51.9c0 7.4 3 12.1 10 12.1zm73.8 17.3c-21 0-31-13.5-31-32.7V54.4c0-19.4 10-32.6 31-32.6 20.7 0 30.7 13.2 30.7 32.6v45.4c0 19.2-10 32.7-30.7 32.7zm0-17.3c6.8 0 9.8-4.7 9.8-12.1V51.2c0-7.4-3-12.2-9.8-12.2-7 0-10.1 4.8-10.1 12.2v51.9c0 7.4 3 12.1 10 12.1zm103.3-113V131h-21v-11h-.3c-2.7 6-6.9 12.5-18 12.5-13.4 0-21.3-8.3-21.3-27.1V48.9c0-18.8 7.2-27.1 20.5-27.1 11.2 0 16.1 6.2 18.8 12.5h.4V2.2h20.9zm-39.7 47.7v54.7c0 6.6 1.9 11 9.3 11 7.2 0 9.5-4.4 9.5-11v-56c-.4-6-2.9-9.7-9.5-9.7-7.4 0-9.3 4.3-9.3 11z"/>
          </svg>
          <div class="Presentation-text">
            ${texts[2]}
            <a class="Presentation-link" onclick=${scrollIntoView} href="#who-we-help">${text`Who we help`}</a>
          </div>
        </div>
        <div class="Presentation-col" style="flex-basis: ${((376 / SIZE) * 100).toFixed(2)}%">
          <svg class="Presentation-title" width="376" height="131" viewBox="0 0 376 131">
            <path fill="#FFF" fill-rule="evenodd" d="M.8 129V.2h50.7v17.7h-29v36.8H44v17.5H22.4V129H.8zm87.3 1.5c-20.9 0-31-13.5-31-32.7V52.4c0-19.4 10.1-32.6 31-32.6 20.7 0 30.8 13.2 30.8 32.6v45.4c0 19.2-10 32.7-30.8 32.7zm0-17.3c6.8 0 9.9-4.7 9.9-12.1V49.2C98 41.8 95 37 88 37s-10 4.8-10 12.2v51.9c0 7.4 3 12.1 10 12.1zm80.7-92.7V45H163c-7.6 0-10.8 3.6-10.8 10.9V129h-21V21.3h21v11h.4c1.7-5 6-11.4 16.3-11.8zm50.1 66h19.6v12.7c0 19.3-9 31.3-29.7 31.3-20.9 0-31-13.5-31-32.7V52.4c0-19.4 10.1-32.6 31-32.6 20.8 0 29.7 11.7 29.7 31.1v7.8h-20.2V49c0-7.4-2.6-12-9.5-12-7 0-10 4.8-10 12.2v51.9c0 7.4 3.4 12.1 10.2 12.1 7 0 10-4.5 10-12.1V86.4zm68.6 0h19.7v12.7c0 19.3-9.1 31.3-29.8 31.3-21 0-31-13.5-31-32.7V52.4c0-19.4 10-32.6 31-32.6 20.7 0 29.8 12 29.8 31.3v26h-39.9v24c0 7.4 3.4 12.1 10.5 12.1 6.8 0 9.7-4.5 9.7-12.1V86.4zm-20.2-37.3v12.7h19.8V49.2c0-7.4-2.9-12.2-9.7-12.2-7 0-10 4.8-10 12.2zm108 49.2v3.6c0 17.3-9 28.5-29 28.5-19.2 0-28.7-11-28.7-29.4V89.9h18.8V102c0 7.6 3 11.2 9.7 11.2 6.7 0 9.5-3.2 9.5-9.7v-3c0-5.3-2.8-8.7-12.3-16.1l-8-6.3c-11.2-8.8-17-15.8-17-29.3v-2.6c0-15.4 8.8-26.5 28.6-26.5 20.5 0 27.7 10.9 27.7 28.7v6H356v-7c0-6.8-2.7-10.4-9.1-10.4-6.5 0-9 3.5-9 8.6v1.7c0 5.1 2.7 8.6 10.1 13.7l7.6 6c14.7 11.6 19.8 16.6 19.8 31.4z"/>
          </svg>
          <div class="Presentation-text">
            ${texts[3]}
            <a class="Presentation-link" onclick=${scrollIntoView} href="#clients-and-friends">${text`Clients and friends`}</a>
          </div>
        </div>
      </div>
    `
  }
}

function scrollIntoView (event) {
  if (event.target.hash !== document.location.hash) return
  const el = document.getElementById(event.target.hash.substr(1))
  if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'})
}
