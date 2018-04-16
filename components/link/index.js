const css = require('sheetify')
const html = require('choo/html')
const Component = require('choo/component')
const { mousemove } = require('../base')
css('./index')

exports.Figure = class Figure extends Component {
  load (element) {
    this.unload = mousemove(element)
  }

  update () {
    return false
  }

  createElement (img) {
    return html`
      <div class="Link-figure">
        ${decorator()}
        <img class="Link-image" src="${img.url}" alt="${img.alt || ''}">
      </div>
    `
  }
}

exports.decorator = decorator
function decorator () {
  return html`
    <div class="Link-decorator">
      <div class="Link-plus"><div class="Link-circle"></div></div>
    </div>
  `
}
