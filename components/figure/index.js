const html = require('choo/html')
const { memo, srcset, className } = require('../base')

module.exports = figure

function figure (image, opts = {}) {
  if (!image) return null
  const desktop = image.url ? image : null
  const mobile = image.url && image.mobile?.url ? image.mobile : null

  const classes = className('Figure', {
    'Figure--mobile': desktop && mobile,
    'Figure--fill': opts.fill,
    'Figure--children': opts.children
  })

  return html`
    <figure class="${classes} ${opts.class ? opts.class : ''}">
      ${desktop ? html`
        <div class="Figure-container" style="--Figure-aspect: ${(desktop.dimensions.height / desktop.dimensions.width * 100).toFixed(2)}%; ${mobile ? `--Figure-aspect-mobile: ${(mobile.dimensions.height / mobile.dimensions.width * 100).toFixed(2)}%` : ''}">
          ${desktop.url ? getImage(desktop, this.size) : null}
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
        src: sources.split(' ')[0],
        loading: 'lazy'
      }, props.dimensions)
    }, [props.url, sizes])

    if (!mobile) {
      return html`<img class="Figure-image" ${attrs} />`
    }

    return html`
      <picture>
        <source srcset="${attrs.srcset}" media="(min-width: 500px)" sizes="${viewport}">
        <img class="Figure-image" alt="${attrs.alt}" srcset="${srcset(mobile.url, sizes)}" sizes="${viewport}" width="${attrs.width}" height="${attrs.height}" src="${attrs.src}" loading="${attrs.loading}"/>
      </picture>
    `
  }
}
