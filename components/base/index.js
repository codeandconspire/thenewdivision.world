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
exports.format = format
exports.formatDuration = formatDuration
exports.debounce = debounce
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
exports.onanimationend = onanimationend
exports.HTTPError = HTTPError
exports.vh = vh
exports.vw = vw
exports.memo = memo
exports.slugify = slugify

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

// format value using Intl
// (any, obj?) -> str
function format (value, opts) {
  let formatter
  if (value instanceof Date) {
    if (typeof Intl === 'undefined' || !Intl.DateTimeFormat) {
      if (!opts.local) {
        // subtract timezone offset unless flagged as a local date
        value = new Date(value.getTime() + value.getTimezoneOffset() * 60 * 1000)
      }
      if (!opts.hour || !opts.minute) return value.toLocaleDateString()
      if (!opts.year || !opts.month || !opts.day || !opts.weekday) {
        return value.toLocaleTimeString().replace(/.00$/, '')
      }
      return value.toLocaleString()
    }

    const args = Object.assign({}, opts)
    delete args.local
    delete args.locales
    if (args.hour === '2-digit') args.hour12 = false
    const locales = typeof window === 'undefined' ? undefined : opts.locales
    formatter = new Intl.DateTimeFormat(locales, Object.assign({
      timeZone: opts.local ? undefined : 'UTC'
    }, args))
  } else if (typeof value === 'number' && !isNaN(value)) {
    if (typeof Intl === 'undefined' || !Intl.NumberFormat) {
      return value.toString()
    }
    formatter = new Intl.NumberFormat(undefined, opts)
  } else {
    throw new Error(`Cannot format type ${typeof value}`)
  }

  return formatter.format(value)
}

// format duration between two dates in days, hours and minutes
// (Date|num, Date?, obj?) -> str
function formatDuration (from, to, opts = {}) {
  if (typeof from === 'number') {
    opts = to || {}
    to = from
    from = 0
  }

  const time = to - from
  let minutes = Math.floor((time / 1000 / 60) % 60)
  let hours = Math.floor(time / (1000 * 60 * 60))
  let res = ''
  if (hours >= 5 && minutes > 50) {
    hours += 1
    minutes = 0
  }
  if (hours >= 10) {
    hours += (minutes > 35) ? 1 : 0
  } else {
    if (minutes && minutes > 10) {
      res = [`${minutes}min`, res].join(' ')
    }
  }
  if (hours) res = [`${hours}h`, res].join(' ')
  return res
}

// debounce function to only run every X ms
// (fn, num?) -> fn
function debounce (fn, delay = 200) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    setTimeout(fn.bind(this), delay, ...args)
  }
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
    case 'homepage': return '/'
    case 'support': return '/support'
    case 'category': return `/support/${doc.uid}`
    case 'post': return `/support/topics/${doc.uid}`
    case 'route': return `/routes/${doc.uid}`
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
    case Elements.paragraph: {
      if (node.text === '' || node.text.match(/^\s+$/)) {
        return html`<!-- Removed empty paragraph -->`
      }
      return null
    }
    default: return null
  }
}

// Run callback on animation end once, with optional (default) timeout fallback
// (Element, fn, num|bool) -> fn
function onanimationend (element, callback, timeout = 250) {
  if ('onanimationend' in window) {
    element.addEventListener('animationend', listener)
    return remove
  } else if (timeout) {
    const id = setTimeout(callback, timeout)
    return clearTimeout.bind(undefined, id)
  }

  function listener (event) {
    if (event.target !== element) return
    remove()
    callback()
  }

  function remove () {
    element.removeEventListener('animationend', listener)
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

// get viewport height
// () -> num
function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

// get viewport width
// () -> num
function vw () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
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

// create a url-friendly string (source: https://gist.github.com/codeguy/6684588)
// (str, bool?) -> str
function slugify (str) {
  str = str.toString()
  if (typeof str.normalize !== 'function') return null
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
