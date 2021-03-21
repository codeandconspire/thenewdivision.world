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
          ${desktop.url ? getImage(desktop, opts) : null}
          ${opts.children ? html`<div class="Figure-children">${opts.children}</div>` : null}
        </div>
      ` : null}
    </figure>
  `

  function getImage (props, opts) {
    let sizes = [351, 387, 702, 774, [1053, 'q_70'], [1161, 'q_60'], [1223, 'q_60'], [1375, 'q_60'], [2446, 'q_60'], [2750, 'q_50']]
    let viewport = '93.6vw, (min-width: 700px) 95.555vw'

    if (opts.half) {
      sizes = [170, 186, 340, 372, 510, 558, 630, 945, [1200, 'q_60'], [1800, 'q_60']]
      viewport = '45.2vw, (min-width: 700px) 46.666vw'
    }

    if (opts.team) {
      sizes = [170, 186, 340, 372, 510, 558, 630, 766, [1200, 'q_60'], [1800, 'q_60']]
      viewport = '45.2vw, (min-width: 700px) 30.370vw'
    }

    if (opts.teaser) {
      sizes = [80, 88, 160, 176, 200, 240, 264, 300, 400, 450, 600, [1000, 'q_70']]
      viewport = '21.2vw, (min-width: 700px) 13.9vw'
    }

    if (!props.url) {
      return null
    }

    const attrs = memo(function (url, sizes) {
      const sources = srcset(props.url, sizes)
      return Object.assign({
        sizes: viewport,
        srcset: sources,
        src: sources.split(' ')[0],
        loading: opts.eager ? 'eager' : 'lazy'
      }, props.dimensions)
    }, [props.url, sizes])

    if (!mobile) {
      return html`<img class="Figure-image" ${attrs} />`
    }

    return html`
      <picture>
        <source srcset="${attrs.srcset}" media="(min-width: 700px)" sizes="${viewport}">
        <img class="Figure-image" alt="${attrs.alt}" srcset="${srcset(mobile.url, sizes)}" sizes="${viewport}" width="${attrs.width}" height="${attrs.height}" src="${attrs.src}" loading="${attrs.loading}"/>
      </picture>
    `
  }
}
