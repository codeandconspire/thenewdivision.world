const assert = require('assert')
const LRU = require('nanolru')
const html = require('choo/html')
const splitRequire = require('split-require')
const { Elements } = require('prismic-richtext')
const LinkHelper = require('prismic-helpers').Link

if (typeof window !== 'undefined') {
  splitRequire('focus-visible')
}

exports.a = a
exports.trigger = trigger
exports.loader = loader
exports.className = className
exports.img = img
exports.src = src
exports.srcset = srcset
exports.metaKey = metaKey
exports.resolve = resolve
exports.asText = asText
exports.serialize = serialize
exports.HTTPError = HTTPError
exports.memo = memo
exports.vh = vh
exports.icon = icon

// create anchor element based on supplied attributes
// (obj, obj?, obj?) -> Element
function a (link, attrs = {}, children) {
  attrs = Object.assign({}, attrs)
  if (!children) children = link.url ? link.url : link

  if (typeof link === 'string') {
    attrs.href = link
  } else {
    attrs.href = LinkHelper.url(link, resolve)
    if (link.target && link.target === '_blank') {
      attrs.target = '_blank'
      attrs.rel = 'noopener noreferrer'
    }
    if (link.link_type === 'Media') {
      attrs.download = true
    }
  }
  return html`<a ${attrs}>${children}</a>`
}

// infer and create element based on supplied props
// (obj, any) -> Element
function trigger (props, children) {
  const attrs = { ...props }
  delete attrs.children
  children = children || props.children
  if (typeof children === 'function') children = children()
  if ('for' in props) return html`<label ${attrs}>${children || null}</label>`
  if ('href' in props) return html`<a ${attrs}>${children || null}</a>`
  return html`<button ${attrs}>${children || null}</button>`
}

// compose class name based on supplied conditions
// (str|obj, obj?) -> str
function className (root, classes) {
  if (typeof root === 'object') {
    classes = root
    root = []
  } else if (typeof root === 'string') {
    root = [root]
  } else {
    root = root.slice()
  }

  return Object.keys(classes).reduce((list, key) => {
    if (!classes[key] || !key) return list
    list.push(key)
    return list
  }, root).join(' ')
}

// create placeholder loading text of given length
// (num, bool?) -> Element
function loader (length, alt = false) {
  const content = '⏳'.repeat(length).split('').reduce(function (str, char, i) {
    if (i % 3 !== 0) char += ' '
    return str + char
  }, '')
  return html`<span class="u-loading${alt ? 'Alt' : ''}">${content}</span>`
}

// create img element based on supplied attributes
// (obj, obj?, obj?) -> Element
function img (image, attrs = {}, opts = {}) {
  if (!image?.url) return null
  attrs = Object.assign({}, attrs)

  if (!attrs.alt) attrs.alt = ''

  let fallback
  if (Array.isArray(opts.sizes)) {
    attrs.srcset = srcset(image.url, opts.sizes, opts)
    const [size, override] = Array.isArray(opts.sizes[0])
      ? opts.sizes[0]
      : [opts.sizes[0]]
    fallback = src(image.url, size, { ...opts, ...override })
  } else {
    fallback = image.url
  }

  return html`<img ${attrs} src="${fallback}">`
}

// compose src attribute from url for a given size
// (str, num, obj?) -> str
function src (uri, size, opts = {}) {
  let { transforms = 'c_fill,f_auto,q_auto', type = 'fetch' } = opts

  // apply default transforms
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/q_/.test(transforms)) transforms += ',q_auto'

  // apply width parameter
  transforms += `,w_${size}`
  if (opts.aspect) transforms += `,h_${Math.floor(size * opts.aspect)}`

  return `/media/${type}/${transforms}/${encodeURIComponent(uri)}`
}

// compose srcset attribute from url for given sizes
// (str, arr, obj?) -> str
function srcset (uri, sizes, _opts = {}) {
  return sizes.map(function (size) {
    const opts = Object.assign({}, _opts)
    if (Array.isArray(size)) {
      opts.transforms = opts.transforms ? size[1] + ',' + opts.transforms : size[1]
      size = size[0]
    }

    return `${src(uri, size, opts)} ${size}w`
  }).join(',')
}

// detect if meta key was pressed on event
// obj -> bool
function metaKey (e) {
  if (e.button && e.button !== 0) return true
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
}

// Resolve prismic document href
// obj -> str
function resolve (doc) {
  switch (doc.type) {
    case 'page': {
      const prefix = doc.lang === 'en-us' ? '' : `/${doc.lang.substring(0, 2)}`
      return doc.uid === 'home' ? prefix || '/' : `${prefix}/${doc.uid}`
    }
    case 'settings':
      return doc.lang === 'en-us' ? '/' : `/${doc.lang.substring(0, 2)}`
    case 'Web':
    case 'Media': return doc.url
    case 'broken_type': return '/404'
    default: {
      // handle links to web and media
      const type = doc.link_type
      if (type === 'Web' || type === 'Media' || type === 'Any') return doc.url
      throw new Error(`Could not resolve href for document type "${doc.type}"`)
    }
  }
}

// Nullable text getter for Prismic text fields
// arr -> str
function asText (richtext) {
  if (typeof richtext === 'string') return richtext
  if (!richtext || !richtext.length) return null
  let text = ''
  for (let i = 0, len = richtext.length; i < len; i++) {
    text += (i > 0 ? ' ' : '') + richtext[i].text
  }
  return text
}

// Custom Prismic HTML serialize
function serialize (type, node, content, children) {
  switch (type) {
    case Elements.paragraph:
    case Elements.heading1:
    case Elements.heading2:
    case Elements.heading3: {
      if (node.text === '' || node.text.match(/^\s+$/)) {
        return html`<!-- Removed empty node -->`
      }
      return null
    }
    default: return null
  }
}

// Custom error with HTTP status code
function HTTPError (status, err) {
  if (!(this instanceof HTTPError)) return new HTTPError(status, err)
  if (!err || typeof err === 'string') err = new Error(err)
  err.status = status
  Object.setPrototypeOf(err, Object.getPrototypeOf(this))
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, HTTPError)
  }
  return err
}

HTTPError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(HTTPError, Error)
} else {
  HTTPError.__proto__ = Error // eslint-disable-line no-proto
}

const MEMO = new LRU()

// momize function
// (fn, arr) -> any
function memo (fn, keys) {
  assert(Array.isArray(keys) && keys.length, 'memo: keys should be non-empty array')
  const key = JSON.stringify(keys)
  let result = MEMO.get(key)
  if (!result) {
    result = fn.apply(undefined, keys)
    MEMO.set(key, result)
  }
  return result
}

function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

// Get icon svg
// (str, obj) -> any
function icon (icon, opts = {}) {
  const icons = {
    twitter: {
      width: 24,
      height: 24,
      fix: true,
      html: html`<path fill="${opts.mono ? 'currentColor' : '#00ACEE'}" d="M6.28 17.12c7.55 0 11.68-6.26 11.68-11.68l-.01-.53c.8-.58 1.5-1.3 2.05-2.13-.73.33-1.52.55-2.36.65a4.1 4.1 0 001.8-2.27c-.79.47-1.66.8-2.6 1A4.1 4.1 0 009.85 5.9 11.65 11.65 0 011.4 1.6a4.12 4.12 0 001.27 5.47c-.67-.01-1.3-.2-1.85-.5v.04c0 2 1.41 3.65 3.3 4.03a4.1 4.1 0 01-1.86.07 4.1 4.1 0 003.83 2.85A8.25 8.25 0 010 15.27a11.44 11.44 0 006.28 1.85z"></path>`
    },
    instagram: {
      width: 24,
      height: 24,
      fix: true,
      html: html`
        <path fill="${opts.mono ? 'currentColor' : '#E1306C'}" d="M19.98 5.88a7.3 7.3 0 00-.46-2.43 4.88 4.88 0 00-1.16-1.77c-.5-.5-1.1-.9-1.77-1.15a7.33 7.33 0 00-2.43-.47A68.25 68.25 0 0010.04 0C7.32 0 6.98.01 5.92.06 4.85.1 4.12.28 3.49.52c-.67.26-1.27.65-1.77 1.16-.51.5-.9 1.1-1.16 1.77A7.33 7.33 0 00.1 5.88 68.25 68.25 0 00.04 10c0 2.72 0 3.06.05 4.12a7.3 7.3 0 00.47 2.43c.25.67.65 1.27 1.16 1.77.5.51 1.1.9 1.77 1.16.63.24 1.36.41 2.42.46 1.07.05 1.4.06 4.12.06s3.06-.01 4.13-.06a7.3 7.3 0 002.42-.46 5.12 5.12 0 002.93-2.93c.24-.64.42-1.36.46-2.43.05-1.06.06-1.4.06-4.12 0-2.71 0-3.05-.05-4.12zm-1.8 8.17c-.04.97-.2 1.5-.34 1.85a3.32 3.32 0 01-1.9 1.9c-.35.14-.89.3-1.86.34-1.05.05-1.37.06-4.04.06A70.3 70.3 0 016 18.14c-.98-.04-1.5-.2-1.85-.34A3.08 3.08 0 013 17.05a3.1 3.1 0 01-.75-1.14 5.5 5.5 0 01-.34-1.86 70.37 70.37 0 01-.06-4.04c0-2.67.01-2.99.06-4.04.04-.98.2-1.5.34-1.86.16-.43.41-.82.75-1.14a3.1 3.1 0 011.15-.75c.35-.14.88-.3 1.86-.34 1.05-.05 1.37-.06 4.03-.06 2.68 0 3 0 4.04.06.98.04 1.5.2 1.86.34.43.16.83.41 1.15.75.33.32.59.71.75 1.14.13.36.3.89.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.98-.06 4.04z"></path>
        <path  fill="${opts.mono ? 'currentColor' : '#E1306C'}" d="M10.04 4.86a5.14 5.14 0 100 10.28 5.14 5.14 0 000-10.28zm0 8.47a3.33 3.33 0 110-6.66 3.33 3.33 0 010 6.66zM16.58 4.66a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
      `
    },
    facebook: {
      width: 24,
      height: 24,
      html: html`<path fill="${opts.mono ? 'currentColor' : '#3B5998'}" d="M17 3.5a.5.5 0 00-.5-.5H14a4.77 4.77 0 00-5 4.5v2.7H6.5a.5.5 0 00-.5.5v2.6a.5.5 0 00.5.5H9v6.7a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-6.7h2.62a.5.5 0 00.49-.37l.72-2.6a.5.5 0 00-.48-.63H13V7.5a1 1 0 011-.9h2.5a.5.5 0 00.5-.5V3.5z"></path>`
    },
    linkedin: {
      width: 24,
      height: 24,
      html: html`<path fill="${opts.mono ? 'currentColor' : '#0E76A8'}" d="M15.15 8.4a5.83 5.83 0 00-5.85 5.82v5.88a.9.9 0 00.9.9h2.1a.9.9 0 00.9-.9v-5.88a1.94 1.94 0 012.15-1.93 2 2 0 011.75 2v5.8a.9.9 0 00.9.9h2.1a.9.9 0 00.9-.9v-5.87a5.83 5.83 0 00-5.85-5.82zM6.6 9.3H3.9c-.5 0-.9.4-.9.9v9.9c0 .5.4.9.9.9h2.7c.5 0 .9-.4.9-.9v-9.9c0-.5-.4-.9-.9-.9zM5.25 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"></path>`
    },
    shop: {
      width: 15,
      height: 22,
      html: html`<path fill="currentColor" d="M13.9 5.45h-2.8v-1.5c0-2-1.6-3.6-3.6-3.6s-3.6 1.6-3.6 3.6v1.5H1.1c-.6 0-1.1.5-1.1 1.1v14c0 .6.5 1.1 1.1 1.1h12.7c.6 0 1.1-.5 1.1-1.1v-14c0-.6-.5-1.1-1-1.1zm-9.2-1.5c0-1.5 1.2-2.8 2.8-2.8 1.5 0 2.8 1.2 2.8 2.8v1.5H4.7v-1.5zm9.1 16.6H1.1v-14h2.8v.9c-.1.1-.2.3-.2.5 0 .3.3.6.6.6s.6-.3.6-.6c0-.2-.1-.3-.2-.4v-1h5.5v.9c-.1.1-.2.3-.2.4 0 .3.3.6.6.6s.6-.3.6-.6c0-.2-.1-.3-.2-.4v-.9h2.8v14z"/>`
    },
    resources: {
      width: 16,
      height: 22,
      html: html`<path fill="currentColor" d="M15.3 20.648H.5c-.3 0-.5.2-.5.5s.2.5.5.5h14.7c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.311 18.448c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9v-8.3c0-.4-.3-.8-.8-.8h-5.2c-.4.1-.7.4-.7.8v8.3h-1.7c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.3c.4 0 .8-.301.8-.801v-8.3h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1z"/>`
    },
    question: {
      width: 21,
      height: 22,
      html: html`<defs><clipPath id="question-a"><path fill="currentColor" d="M0 0h20.2v22H0z"/></clipPath></defs><g clip-path="url(#question-a)"><path fill="currentColor" d="M10.102 1.47A10.088 10.088 0 000 11.574c0 5.59 4.512 10.101 10.102 10.101 5.59 0 10.102-4.511 10.102-10.101 0-5.59-4.512-10.102-10.102-10.102zm1.357 15.972c0 .2-.16.36-.359.36H8.944c-.2 0-.36-.16-.36-.36v-2.156c0-.2.16-.36.36-.36H11.1c.2 0 .36.16.36.36v2.156zm.64-5.75c-.68.52-.84.799-.84 1.478v.36c0 .199-.159.359-.359.359H9.104c-.2 0-.36-.16-.36-.36v-.36c0-.758.04-1.477.52-2.075.399-.52.998-.8 1.397-1.158.36-.36.679-.839.679-1.238 0-.719-.56-1.198-1.278-1.198-.799 0-1.278.479-1.278 1.238v.32c0 .199-.16.358-.36.358H6.589c-.2 0-.36-.16-.36-.359v-.28c0-2.315 1.558-3.753 3.794-3.753 2.316 0 3.793 1.478 3.793 3.554.04 1.477-.918 2.555-1.717 3.114z"/></g>`
    },
    chat: {
      width: 20,
      height: 22,
      html: html`<path fill="currentColor" d="M19.663 16.807v-9.06a.756.756 0 00-.752-.753h-2.328v6.948c0 .609-.502 1.074-1.075 1.074H4.943v2.292c0 .43.358.753.752.753h10.171L19.663 22v-5.121-.072z"/><path fill="currentColor" d="M14.72 12.473V2.91a.757.757 0 00-.753-.752H.752A.756.756 0 000 2.91v14.254l3.796-3.94h10.171a.757.757 0 00.752-.752z"/>`
    },
    team: {
      width: 25,
      height: 22,
      html: html`<path fill="currentColor" d="M22.554 15.17c-2.781-2.694-6.736-2.65-6.736-2.65h-.173c1 .478 1.912 1.173 2.78 2.042 2.434 2.347 2.608 4.998 2.695 6.084h3.738a.093.093 0 00.087-.087c0-.478-.087-3.172-2.39-5.389zM16.038 6.697c0 1.782-.826 3.39-2.13 4.476.478.174.956.26 1.478.26a4.674 4.674 0 004.693-4.693 4.674 4.674 0 00-4.693-4.693c-.522 0-1 .087-1.478.26 1.304 1 2.13 2.608 2.13 4.39zM9.43 12.52s-4.215-.13-7.04 2.651C.087 17.431 0 20.082 0 20.561c0 .043.043.086.087.086h18.687a.093.093 0 00.087-.087c0-.521-.087-3.172-2.39-5.389-2.738-2.694-7.04-2.65-7.04-2.65z"/><path fill="currentColor" d="M9.342 11.434a4.694 4.694 0 100-9.387 4.694 4.694 0 000 9.387z"/>`
    },
    contact: {
      width: 20,
      height: 22,
      html: html`<path fill="currentColor" d="M20 3.504a.29.29 0 00-.076-.189l-2.273-2.273a.297.297 0 00-.416 0l-2.576 2.576H.795A.8.8 0 000 4.413v15.834a.8.8 0 00.795.795H16.63a.8.8 0 00.795-.795V6.232l2.5-2.5c.038-.076.076-.152.076-.228zM15.152 18.77H2.31V5.89h10.113l-3.94 3.902c-.037.038-.075.076-.075.152l-1.44 3.674a.294.294 0 00.076.303.29.29 0 00.19.076h.113l3.713-1.44c.037-.037.113-.037.151-.113l3.977-3.978V18.77h-.037zm-4.887-6.516l-1.856.72-.417-.417.72-1.856 1.553 1.553z"/>`
    },
    newsletter: {
      width: 20,
      height: 22,
      html: html`<defs><clipPath id="newsletter-a"><path fill="currentColor" d="M0 0h19.68v22H0z"/></clipPath></defs><g clip-path="url(#newsletter-a)"><path fill="currentColor" d="M18.925 4.104H.754c-.415 0-.754.339-.754 1.13v14.25c0 .038.34.378.754.378h18.171c.415 0 .754-.34.754-.377V5.235c0-.792-.34-1.131-.754-1.131zm-1.131 4.222c0 .038 0 .038-.038.075l-7.728 4.901h-.075l-7.88-4.9c-.037 0-.037-.038-.037-.076V6.064c0-.076.075-.113.113-.076l7.728 4.977h.076l7.728-4.863c.038-.038.113 0 .113.075v2.149z"/></g>`
    }
  }

  if (!icon) return null
  const select = icons[icon.toLowerCase()]
  if (!select) return null

  return html`
    <svg class="${opts.class}" role="presentation" width="${select.width}" height="${select.height}" viewBox="0 0 ${select.width} ${select.height}" style="${select.fix ? 'position: relative; top: 0.125rem; left: 0.1875rem' : ''}">
      <g fill="currentColor" fill-rule="evenodd">${select.html}</g>
    </svg>
  `
}
