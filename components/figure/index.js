var html = require('choo/html')
var Component = require('choo/component')
var {mousemove, imgattrs} = require('../base')

module.exports = Figure

// wrapper class that only instantiates a Component if needed
// (str, obj, fn, opts) -> obj
function Figure (id, state, emit, opts) {
  opts = opts || {}
  if (opts.interactive) return new InteractiveFigure(id, state, emit, opts)
  Object.assign(this, opts)
}

Figure.prototype.render = createElement

Figure.id = function (img) {
  return img.url.match(/.+\/(.+?)\.(?:jpg|jpeg|png|svg|gif)$/)[1]
}

class InteractiveFigure extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
    this.createElement = createElement
  }

  static id (img) {
    return img.url.match(/.+\/(.+?)\.(?:jpg|jpeg|png|svg|gif)$/)[1]
  }

  load (element) {
    this.unload = mousemove(element)
  }

  update () {
    return false
  }
}

function createElement (img) {
  var attrs = imgattrs(img, this.sizes)
  return html`
    <figure class="Figure">
      <div class="Figure-container" style="padding-bottom:${(img.dimensions.height / img.dimensions.width * 100).toFixed(2)}%;">
        ${this.interactive ? decorator() : null}
        <img class="Figure-image" ${attrs}>
      </div>
      ${img.alt ? html`
        <figcaption class="Figure-caption">${img.alt}</figcaption>
      ` : null}
    </figure>
  `
}

function decorator () {
  return html`
    <div class="Figure-decorator">
      <div class="Figure-plus js-plus"><div class="Figure-circle"></div></div>
    </div>
  `
}
