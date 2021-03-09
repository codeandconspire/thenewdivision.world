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
          ${desktop.url ? getImage(desktop, opts.half) : null}
          ${opts.children ? html`<div class="Figure-children">${opts.children}</div>` : null}
        </div>
      ` : null}
    </figure>
  `

  function getImage (props, half) {
    const sizes = [170, 351, 510, 702, 1053, 1376, [2000, 'q_70'], [2752, 'q_60'], [4000, 'q_40']]
    const viewport = half ? '45vw' : '95vw'

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
        <source srcset="${attrs.srcset}" media="(min-width: 800px)" sizes="${viewport}">
        <img class="Figure-image" alt="${attrs.alt}" srcset="${srcset(mobile.url, sizes)}" sizes="${viewport}" width="${attrs.width}" height="${attrs.height}" src="${attrs.src}" loading="${attrs.loading}"/>
      </picture>
    `
  }
}
