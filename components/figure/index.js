const css = require('sheetify')
const html = require('choo/html')
const Component = require('choo/component')
const { mousemove } = require('../base')
css('./index')

module.exports = class Figure extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
    if (this.interactive) this.load = this.init
  }

  static id (img) {
    return img.url.match(/.+\/(.+?)\.(?:jpg|jpeg|png|svg|gif)$/)[1]
  }

  init (element) {
    this.unload = mousemove(element)
  }

  update () {
    return false
  }

  createElement (img) {
    return html`
      <figure class="Figure">
        <div class="Figure-container" style="padding-bottom:${(img.dimensions.height / img.dimensions.width * 100).toFixed(2)}%;">
          ${this.interactive ? decorator() : null}
          <img class="Figure-image" src="${img.url}" width="${img.dimensions.width}" height="${img.dimensions.height}" alt="${img.alt || ''}">
        </div>
        ${img.alt ? html`
          <figcaption class="Figure-caption">${img.alt}</figcaption>
        ` : null}
      </figure>
    `
  }
}

function decorator () {
  return html`
    <div class="Figure-decorator">
      <div class="Figure-plus"><div class="Figure-circle"></div></div>
    </div>
  `
}
