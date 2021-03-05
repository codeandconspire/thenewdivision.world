const fs = require('fs')
const path = require('path')
const assert = require('assert')
const LRU = require('nanolru')
const html = require('choo/html')
const splitRequire = require('split-require')
const { Elements } = require('prismic-richtext')
const LinkHelper = require('prismic-helpers').Link
const lang = require('./lang.json')

if (typeof window !== 'undefined') {
  splitRequire('focus-visible')
  splitRequire('smoothscroll-polyfill').then(function (smoothscroll) {
    smoothscroll.polyfill()
  })
}

exports.a = a
exports.trigger = trigger
exports.loader = loader
exports.className = className
exports.img = img
exports.src = src
exports.srcset = srcset
exports.metaKey = metaKey
exports.text = text
exports.resolve = resolve
exports.asText = asText
exports.serialize = serialize
exports.HTTPError = HTTPError
exports.memo = memo
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
    case 'page': return `/${doc.uid}`
    case 'Web':
    case 'Media': return doc.url
    default: {
      // handle links to web and media
      const type = doc.link_type
      if (type === 'Web' || type === 'Media' || type === 'Any') return doc.url
      throw new Error(`Could not resolve href for document type "${doc.type}"`)
    }
  }
}

// Get text by applying as tagged template literal i.e. text`Hello ${str}`
function text (strings, ...parts) {
  parts = parts || []

  const key = Array.isArray(strings) ? strings.join('%s') : strings
  let value = lang[key]

  if (!value) {
    value = lang[key] = key
    if (typeof window === 'undefined') {
      const file = path.join(__dirname, 'lang.json')
      fs.writeFileSync(file, JSON.stringify(lang, null, 2))
    }
  }

  let hasForeignPart = false
  const res = value.split('%s').reduce(function (result, str, index) {
    const part = parts[index] || ''
    if (!hasForeignPart) {
      hasForeignPart = (typeof part !== 'string' && typeof part !== 'number')
    }
    result.push(str, part)
    return result
  }, [])

  return hasForeignPart ? res : res.join('')
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

// Get icon svg
// (str, obj) -> any
function icon (icon, attrs = {}) {
  const icons = {
    twitter: {
      size: 24,
      fix: true,
      html: html`<path fill="${attrs.mono ? 'currentColor' : '#00ACEE'}" d="M6.28 17.12c7.55 0 11.68-6.26 11.68-11.68l-.01-.53c.8-.58 1.5-1.3 2.05-2.13-.73.33-1.52.55-2.36.65a4.1 4.1 0 001.8-2.27c-.79.47-1.66.8-2.6 1A4.1 4.1 0 009.85 5.9 11.65 11.65 0 011.4 1.6a4.12 4.12 0 001.27 5.47c-.67-.01-1.3-.2-1.85-.5v.04c0 2 1.41 3.65 3.3 4.03a4.1 4.1 0 01-1.86.07 4.1 4.1 0 003.83 2.85A8.25 8.25 0 010 15.27a11.44 11.44 0 006.28 1.85z"/>`
    },
    instagram: {
      size: 24,
      fix: true,
      html: html`
        <path fill="${attrs.mono ? 'currentColor' : '#E1306C'}" d="M19.98 5.88a7.3 7.3 0 00-.46-2.43 4.88 4.88 0 00-1.16-1.77c-.5-.5-1.1-.9-1.77-1.15a7.33 7.33 0 00-2.43-.47A68.25 68.25 0 0010.04 0C7.32 0 6.98.01 5.92.06 4.85.1 4.12.28 3.49.52c-.67.26-1.27.65-1.77 1.16-.51.5-.9 1.1-1.16 1.77A7.33 7.33 0 00.1 5.88 68.25 68.25 0 00.04 10c0 2.72 0 3.06.05 4.12a7.3 7.3 0 00.47 2.43c.25.67.65 1.27 1.16 1.77.5.51 1.1.9 1.77 1.16.63.24 1.36.41 2.42.46 1.07.05 1.4.06 4.12.06s3.06-.01 4.13-.06a7.3 7.3 0 002.42-.46 5.12 5.12 0 002.93-2.93c.24-.64.42-1.36.46-2.43.05-1.06.06-1.4.06-4.12 0-2.71 0-3.05-.05-4.12zm-1.8 8.17c-.04.97-.2 1.5-.34 1.85a3.32 3.32 0 01-1.9 1.9c-.35.14-.89.3-1.86.34-1.05.05-1.37.06-4.04.06A70.3 70.3 0 016 18.14c-.98-.04-1.5-.2-1.85-.34A3.08 3.08 0 013 17.05a3.1 3.1 0 01-.75-1.14 5.5 5.5 0 01-.34-1.86 70.37 70.37 0 01-.06-4.04c0-2.67.01-2.99.06-4.04.04-.98.2-1.5.34-1.86.16-.43.41-.82.75-1.14a3.1 3.1 0 011.15-.75c.35-.14.88-.3 1.86-.34 1.05-.05 1.37-.06 4.03-.06 2.68 0 3 0 4.04.06.98.04 1.5.2 1.86.34.43.16.83.41 1.15.75.33.32.59.71.75 1.14.13.36.3.89.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.98-.06 4.04z"/>
        <path  fill="${attrs.mono ? 'currentColor' : '#E1306C'}" d="M10.04 4.86a5.14 5.14 0 100 10.28 5.14 5.14 0 000-10.28zm0 8.47a3.33 3.33 0 110-6.66 3.33 3.33 0 010 6.66zM16.58 4.66a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>
      `
    },
    facebook: {
      size: 24,
      html: html`<path fill="${attrs.mono ? 'currentColor' : '#3B5998'}" d="M17 3.5a.5.5 0 00-.5-.5H14a4.77 4.77 0 00-5 4.5v2.7H6.5a.5.5 0 00-.5.5v2.6a.5.5 0 00.5.5H9v6.7a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-6.7h2.62a.5.5 0 00.49-.37l.72-2.6a.5.5 0 00-.48-.63H13V7.5a1 1 0 011-.9h2.5a.5.5 0 00.5-.5V3.5z"/>`
    },
    linkedin: {
      size: 24,
      html: html`<path fill="${attrs.mono ? 'currentColor' : '#0E76A8'}" d="M15.15 8.4a5.83 5.83 0 00-5.85 5.82v5.88a.9.9 0 00.9.9h2.1a.9.9 0 00.9-.9v-5.88a1.94 1.94 0 012.15-1.93 2 2 0 011.75 2v5.8a.9.9 0 00.9.9h2.1a.9.9 0 00.9-.9v-5.87a5.83 5.83 0 00-5.85-5.82zM6.6 9.3H3.9c-.5 0-.9.4-.9.9v9.9c0 .5.4.9.9.9h2.7c.5 0 .9-.4.9-.9v-9.9c0-.5-.4-.9-.9-.9zM5.25 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"/>`
    },
    shop: {
      size: 24,
      html: html`<path fill="currentColor" d="M16.1 18H1.3c-.3 0-.5.2-.5.5s.2.5.5.5H16c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.9 15.8c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9V1c0-.4-.3-.8-.8-.8H5.7C5.3.3 5 .6 5 1v8.3H3.3c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.4c.4 0 .8-.3.8-.8V1.4h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1v-.1z"/>`
    },
    download: {
      size: 24,
      html: html`<path fill="currentColor" d="M14.8 5.8H12V4.3c0-2-1.6-3.6-3.6-3.6S4.8 2.3 4.8 4.3v1.5H2c-.6 0-1.1.5-1.1 1.1v14c0 .6.5 1.1 1.1 1.1h12.7c.6 0 1.1-.5 1.1-1.1v-14c0-.6-.5-1.1-1-1.1zM5.6 4.3a2.8 2.8 0 115.6 0v1.5H5.6V4.3zm9.1 16.6H2v-14h2.8v.9c-.1.1-.2.3-.2.5 0 .3.3.6.6.6s.6-.3.6-.6c0-.2-.1-.3-.2-.4v-1h5.5v.9c-.1.1-.2.3-.2.4 0 .3.3.6.6.6s.6-.3.6-.6c0-.2-.1-.3-.2-.4v-.9h2.8v14z"/>`
    },
    question: {
      size: 80,
      html: html`<path fill="currentColor" d="M16.1 18H1.3c-.3 0-.5.2-.5.5s.2.5.5.5H16c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.9 15.8c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9V1c0-.4-.3-.8-.8-.8H5.7C5.3.3 5 .6 5 1v8.3H3.3c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.4c.4 0 .8-.3.8-.8V1.4h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1v-.1z"/>`
    },
    chat: {
      size: 80,
      html: html`<path fill="currentColor" d="M16.1 18H1.3c-.3 0-.5.2-.5.5s.2.5.5.5H16c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.9 15.8c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9V1c0-.4-.3-.8-.8-.8H5.7C5.3.3 5 .6 5 1v8.3H3.3c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.4c.4 0 .8-.3.8-.8V1.4h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1v-.1z"/>`
    },
    team: {
      size: 80,
      html: html`<path fill="currentColor" d="M16.1 18H1.3c-.3 0-.5.2-.5.5s.2.5.5.5H16c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.9 15.8c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9V1c0-.4-.3-.8-.8-.8H5.7C5.3.3 5 .6 5 1v8.3H3.3c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.4c.4 0 .8-.3.8-.8V1.4h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1v-.1z"/>`
    },
    contact: {
      size: 80,
      html: html`<path fill="currentColor" d="M16.1 18H1.3c-.3 0-.5.2-.5.5s.2.5.5.5H16c.3 0 .5-.2.5-.5s-.1-.5-.4-.5zM7.9 15.8c.2.1.3.2.5.2s.4-.1.5-.2l5.2-5.2c.2-.2.3-.5.2-.8-.1-.3-.4-.5-.7-.5h-1.9V1c0-.4-.3-.8-.8-.8H5.7C5.3.3 5 .6 5 1v8.3H3.3c-.3 0-.6.2-.7.5-.1.3-.1.6.2.8l5.1 5.2zm-2.6-5.4c.4 0 .8-.3.8-.8V1.4h4.5v8.3c0 .4.3.8.8.8h1.4l-4.3 4.3-4.3-4.3h1.1v-.1z"/>`
    }
  }

  if (!icon || !icons[icon.toLowerCase()]) return null
  const select = icons[icon.toLowerCase()]

  return html`
    <svg ${attrs} role="presentation" width="${select.size}" height="${select.size}" style="${select.fix ? 'position: relative; top: 0.125rem; left: 0.1875rem' : ''}" viewBox="0 0 ${select.size} ${select.size}">
      <g fill="currentColor" fill-rule="evenodd">${select.html}</g>
    </svg>
  `
}
