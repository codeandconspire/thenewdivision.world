const css = require('sheetify')
const html = require('choo/html')
const Component = require('choo/component')
const { observe } = require('../base')
css('./index')

exports.Figure = class Figure extends Component {
  load (element) {
    const random = Math.random() * (2.5 - -2.5) + -2.5
    element.style.setProperty('--rotation', `${random}deg`)
    this.unload = observe(element, function () {
      // detach()
    })
  }

  createElement (img) {
    return html`
      <div class="Link-figure">
        ${decorator()}
        <img src="${img.url}" class="Link-image">
      </div>
    `
  }
}

exports.decorator = decorator
function decorator () {
  return html`
    <span class="Link-decorator">
      <svg class="Link-plus" width="20" height="20" viewBox="0 0 20 20">
        <path fill="#EFECE5" fill-rule="evenodd" d="M12.5 7.5H20v5h-7.5V20h-5v-7.5H0v-5h7.5V0h5v7.5z"/>
      </svg>
    </span>
  `
}
