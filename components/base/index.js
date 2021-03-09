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
      size: 44,
      html: html`<path fill="currentColor" d="m35.3239 10.5352h-5.784v-3.09858c0-4.13146-3.3052-7.43662-7.4366-7.43662-4.1315 0-7.4366 3.30516-7.4366 7.43662v3.09858h-5.78407c-1.23944 0-2.2723 1.0329-2.2723 2.2723v28.9202c0 1.2394 1.03286 2.2723 2.2723 2.2723h26.23477c1.2394 0 2.2723-1.0329 2.2723-2.2723v-28.9202c0-1.2394-1.0329-2.2723-2.0658-2.2723zm-19.0047-3.09858c0-3.09859 2.4789-5.78404 5.7841-5.78404 3.0986 0 5.784 2.47888 5.784 5.78404v3.09858h-11.5681zm18.7982 34.29108h-26.23477v-28.9202h5.78407v1.8592c-.2066.2065-.4132.6197-.4132 1.0328 0 .6197.6197 1.2395 1.2395 1.2395.6197 0 1.2394-.6198 1.2394-1.2395 0-.4131-.2066-.6197-.4132-.8263v-2.0657h11.3616v1.8592c-.2066.2065-.4132.6197-.4132.8263 0 .6197.6197 1.2394 1.2394 1.2394.6198 0 1.2395-.6197 1.2395-1.2394 0-.4132-.2066-.6198-.4132-.8263v-1.8592h5.7841z"/>`
    },
    resources: {
      size: 44,
      html: html`<g fill="currentColor"><path d="m39.4362 41.6595h-34.63833c-.70213 0-1.17021.4681-1.17021 1.1703 0 .7021.46808 1.1702 1.17021 1.1702h34.40423c.7022 0 1.1702-.4681 1.1702-1.1702 0-.7022-.234-1.1703-.9361-1.1703z"/><path d="m20.2447 36.5106c.4681.2341.7021.4681 1.1702.4681s.9362-.234 1.1702-.4681l12.1702-12.1702c.4681-.4681.7021-1.1702.4681-1.8723s-.9362-1.1702-1.6383-1.1702h-4.4468v-19.42556c0-.93617-.7021-1.87234-1.8723-1.87234h-12.1703c-.9361.234043-1.6383.93617-1.6383 1.87234v19.42556h-3.97868c-.70212 0-1.40425.4681-1.63829 1.1702-.23405.7021-.23405 1.4042.46808 1.8723zm-6.0851-12.6383c.9361 0 1.8723-.7021 1.8723-1.8723v-19.19149h10.5319v19.42549c0 .9362.7022 1.8724 1.8724 1.8724h3.2766l-10.0639 10.0638-10.0638-10.0638h2.5745z"/></g>`
    },
    question: {
      size: 44,
      html: html`<path fill="currentColor" d="m22 1c-11.6206 0-21 9.3794-21 21s9.3794 21 21 21 21-9.3794 21-21-9.3794-21-21-21zm2.8221 33.2016c0 .415-.332.747-.747.747h-4.4822c-.415 0-.7471-.332-.7471-.747v-4.4822c0-.4151.3321-.7471.7471-.7471h4.4822c.415 0 .747.332.747.7471zm1.3281-11.9526c-1.4111 1.0791-1.7431 1.6601-1.7431 3.0712v.747c0 .415-.332.747-.747.747h-3.7352c-.415 0-.747-.332-.747-.747v-.747c0-1.5771.083-3.0712 1.079-4.3162.8301-1.0791 2.0751-1.6601 2.9052-2.4072.747-.747 1.411-1.743 1.411-2.5731 0-1.4941-1.162-2.4901-2.6561-2.4901-1.6601 0-2.6561.996-2.6561 2.5731v.6641c0 .415-.332.747-.7471.747h-3.8181c-.4151 0-.7471-.332-.7471-.747v-.5811c0-4.8142 3.2372-7.80235 7.8854-7.80235 4.8142 0 7.8854 3.07115 7.8854 7.38735.083 3.0711-1.9091 5.3123-3.5692 6.4743z"/>`
    },
    chat: {
      size: 44,
      html: html`<g fill="currentColor"><path d="m42 33.4353v-18.4335c0-.8743-.7286-1.53-1.53-1.53h-4.7359v14.1348c0 1.2386-1.0201 2.1858-2.1858 2.1858h-21.4936v4.663c0 .8743.7286 1.53 1.53 1.53h20.6922l7.7231 8.0146v-10.4189c0-.0729 0-.1458 0-.1458z"/><path d="m31.9454 24.6193v-19.45353c0-.87432-.7286-1.53006-1.5301-1.53006h-26.88525c-.87431 0-1.53005.7286-1.53005 1.53006v18.43353.1457 10.4189l7.72313-8.0145h20.69217c.8015 0 1.5301-.6558 1.5301-1.5301z"/></g>`
    },
    team: {
      size: 44,
      html: html`<g fill="currentColor"><path d="m39.784 27.7457c-4.9059-4.7526-11.8816-4.676-11.8816-4.676s-.0766 0-.3066 0c1.7631.8432 3.3728 2.0697 4.9059 3.6028 4.2927 4.1394 4.5994 8.8153 4.7527 10.7317h6.5923c.0767 0 .1533-.0766.1533-.1533 0-.8432-.1533-5.5958-4.216-9.5052z"/><path d="m28.2857 12.7979c0 3.1429-1.4564 5.9791-3.7561 7.8955.8432.3066 1.6864.4599 2.6063.4599 4.5993 0 8.2787-3.6794 8.2787-8.2787 0-4.59933-3.6794-8.27877-8.2787-8.27877-.9199 0-1.7631.15331-2.6063.45993 2.2997 1.76306 3.7561 4.5993 3.7561 7.74214z"/><path d="m16.6341 23.0697s-7.43549-.23-12.41807 4.6759c-4.06272 3.9861-4.21603 8.6621-4.21603 9.5053 0 .0766.0766549.1533.15331.1533h16.40419.1533 16.4042c.0766 0 .1533-.0767.1533-.1533 0-.9199-.1533-5.5958-4.216-9.5053-4.8293-4.7526-12.4182-4.6759-12.4182-4.6759z"/><path d="m16.4808 21.1533c4.5723 0 8.2788-3.7065 8.2788-8.2787 0-4.57225-3.7065-8.27877-8.2788-8.27877-4.5722 0-8.27871 3.70652-8.27871 8.27877 0 4.5722 3.70651 8.2787 8.27871 8.2787z"/></g>`
    },
    contact: {
      size: 44,
      html: html`<path fill="currentColor" d="m44 5.32673c0-.15841-.0792-.31683-.1584-.39604l-4.7525-4.752472c-.2376-.2376239-.6336-.2376239-.8713 0l-5.3861 5.386142h-28.99011c-.87129 0-1.66337.71287-1.66337 1.66336v33.10888c0 .8713.71287 1.6634 1.66337 1.6634h33.10891c.8713 0 1.6634-.7129 1.6634-1.6634v-29.3069l5.2277-5.22772c.0792-.15842.1584-.31683.1584-.47525zm-10.1386 31.92077h-26.85149v-26.9307h21.14849l-8.2376 8.1584c-.0792.0793-.1584.1585-.1584.3169l-3.0099 7.6831c-.0792.2377 0 .4753.1584.6337.0792.0792.2376.1584.396.1584h.2377l7.7623-3.0099c.0792-.0792.2377-.0792.3169-.2376l8.3168-8.3168v21.5445zm-10.2178-13.6237-3.8812 1.5049-.8713-.8713 1.5049-3.8812z"/>`
    },
    newsletter: {
      size: 44,
      html: html`<path fill="currentColor" d="m41.3908 5.18393h-38.7816c-.88506 0-1.6092.72414-1.6092 2.41379v30.41378c0 .0805.72414.8046 1.6092.8046h38.7816c.8851 0 1.6092-.7241 1.6092-.8046v-30.41378c0-1.68965-.7241-2.41379-1.6092-2.41379zm-2.4138 9.01147c0 .0805 0 .0805-.0805.1609l-16.4942 10.4598c-.0805 0-.0805 0-.1609 0l-16.81611-10.4598c-.08046 0-.08046-.0804-.08046-.1609v-4.82756c0-.16092.16092-.24138.24138-.16092l16.49429 10.62068h.1609l16.4942-10.3793c.0805-.08046.2414 0 .2414.16092z"/>`
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
