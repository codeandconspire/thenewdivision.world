const html = require('choo/html')
const Component = require('choo/component')
const { memo, srcset, className } = require('../base')

module.exports = class Figure extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  load (element) {
    const video = element.querySelector('.js-video')
    if (!video) return

    // Play video on document interaction
    document.documentElement.addEventListener('click', function onclick () {
      video.play().catch(Function.prototype)
      document.documentElement.removeEventListener('click', onclick)
    })
    document.documentElement.addEventListener('touchstart', function ontouchstart () {
      video.play().catch(Function.prototype)
      document.documentElement.removeEventListener('touchstart', ontouchstart)
    })
  }

  update (content) {
    return true
  }

  createElement (content, opts = {}) {
    if (!content) return null
    const image = content.url ? content : null
    const mobile = content.url && content.mobile?.url ? content.mobile : null
    const video = content.video?.url ? content.video : null

    const classes = className('Figure', {
      'Figure--mobile': image && mobile,
      'Figure--video': video,
      'Figure--fill': opts.fill,
      'Figure--children': opts.children
    })

    return html`
      <figure class="${classes} ${opts.class ? opts.class : ''}">
        ${image ? html`
          <div class="Figure-container" style="--Figure-aspect: ${(image.dimensions.height / image.dimensions.width * 100).toFixed(2)}%; ${mobile ? `--Figure-aspect-mobile: ${(mobile.dimensions.height / mobile.dimensions.width * 100).toFixed(2)}%` : ''}">
            ${image.url ? getImage(image, this.size) : null}
            ${opts.children ? html`<div class="Figure-children">${opts.children}</div>` : null}
          </div>
        ` : null}

        ${video ? html`
          <div class="Figure-container">
            <div class="Figure-poster">
              <video class="Figure-video js-video" playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop" disablepictureinpicture width="960" height="540" preload="auto" poster="${video.poster?.url || ''}">
                <source src="${video.url}" type="video/mp4" />
              </video>
            </div>
            ${opts.children ? html`<div class="Figure-children">${opts.children}</div>` : null}
          </div>
        ` : null}
      </figure>
    `

    function getImage (props) {
      const sizes = [640, 750, 1125, 1440, [2880, 'q_70'], [3840, 'q_50']]
      const viewport = '90vw'

      if (!props.url) {
        return null
      }

      const attrs = memo(function (url, sizes) {
        const sources = srcset(props.url, sizes)
        return Object.assign({
          sizes: viewport,
          srcset: sources,
          mobile: mobile || '',
          src: sources.split(' ')[0],
          loading: 'lazy'
        }, props.dimensions)
      }, [props.url, sizes])

      if (!mobile) {
        return html`<img class="Figure-image" ${attrs}>`
      }

      return html`
        <picture>
          <source srcset="${attrs.srcset}" media="(min-width: 500px)" sizes="${viewport}">
          <img class="Figure-image" alt="${attrs.alt}" srcset="${srcset(mobile.url, sizes)}" sizes="${viewport}" width="${attrs.width}" height="${attrs.height}" src="${attrs.src}" loading="${attrs.loading}">
        </picture>
      `
    }
  }
}
