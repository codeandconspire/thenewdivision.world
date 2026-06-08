// Image transformation via Cloudflare Images URL format:
//   /cdn-cgi/image/<options>/<source-url>
// This replaces the old Cloudinary `/media/...` proxy. Source images are the
// original Prismic URLs (images.prismic.io); the transform tokens mirror the
// Cloudinary syntax the components were written against so the responsive
// `sizes` arrays in Figure can stay identical.

const DEFAULT_TRANSFORMS = 'c_fill,f_auto,q_auto'

// Image URLs are emitted as absolute production URLs. On Cloudflare the
// `/cdn-cgi/image/` path is handled at the edge before the app; making the URL
// absolute also means the static prerenderer treats it as external and does not
// try to crawl (and Prismic-query) every responsive variant.
const ORIGIN = 'https://www.thenewdivision.world'

// Compose a Cloudflare transformation URL for a single size.
// (str, num, obj?) -> str   — same signature as the original base.js#src
export function src (uri, size, opts = {}) {
  let { transforms = DEFAULT_TRANSFORMS } = opts
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/q_/.test(transforms)) transforms += ',q_auto'
  transforms += `,w_${size}`
  if (opts.aspect) transforms += `,h_${Math.floor(size * opts.aspect)}`
  return cloudflareUrl(uri, transforms)
}

// Compose a srcset string for the given sizes (ported from base.js#srcset).
// Sizes may be a number or [number, extraTransform].
export function srcset (uri, sizes, _opts = {}) {
  return sizes
    .map(function (size) {
      const opts = Object.assign({}, _opts)
      if (Array.isArray(size)) {
        opts.transforms = opts.transforms ? size[1] + ',' + opts.transforms : size[1]
        size = size[0]
      }
      return `${src(uri, size, opts)} ${size}w`
    })
    .join(',')
}

// Transform without resizing (used for client logos — old `/media/fetch/_/`).
export function transform (uri, transforms = 'f_auto') {
  return cloudflareUrl(uri, transforms)
}

// Translate a Cloudinary-style transform string to a Cloudflare options path.
function cloudflareUrl (uri, transforms) {
  // Cloudflare Image Transformations only exist on the Cloudflare edge. During
  // `vite dev` there is no edge, so fall back to the original Prismic URL.
  if (import.meta.env.DEV) return uri

  let width, height, quality
  let fit = 'cover'
  let format = 'auto'

  for (const token of transforms.split(',')) {
    if (token.startsWith('w_')) width = token.slice(2)
    else if (token.startsWith('h_')) height = token.slice(2)
    else if (token === 'q_auto') quality = undefined
    else if (token.startsWith('q_')) quality = token.slice(2)
    else if (token === 'c_fill') fit = 'cover'
    else if (token === 'c_fit') fit = 'contain'
    else if (token === 'c_limit') fit = 'scale-down'
    else if (token === 'f_auto') format = 'auto'
  }

  const options = [`format=${format}`, `fit=${fit}`]
  if (width) options.push(`width=${width}`)
  if (height) options.push(`height=${height}`)
  if (quality) options.push(`quality=${quality}`)

  return `${ORIGIN}/cdn-cgi/image/${options.join(',')}/${uri}`
}
