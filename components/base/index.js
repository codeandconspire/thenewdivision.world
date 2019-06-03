var fs = require('fs')
var path = require('path')
var assert = require('assert')
var html = require('choo/html')
var nanoraf = require('nanoraf')
var LRU = require('nanolru')
var common = require('./lang.json')

if (typeof window !== 'undefined') {
  require('smoothscroll-polyfill').polyfill()
}

var cache = []
if (typeof window !== 'undefined') {
  window.addEventListener('resize', nanoraf(function () {
    for (let i = 0, len = cache.length, el; i < len; i++) {
      el = cache[i][0]
      cache[i][1] = {top: el.offsetTop, height: el.offsetHeight}
      inview(cache[i])
    }
  }))
  window.addEventListener('scroll', nanoraf(function () {
    for (let i = 0, len = cache.length; i < len; i++) inview(cache[i])
  }), {passive: true})
}

// inspect element position relative to scroll offset
// arr -> void
function inview ([el, box, cb]) {
  var viewport = vh()
  var scroll = window.scrollY
  var top = Math.max(scroll - box.top, 0)
  var bottom = Math.min((scroll + viewport) - (box.top + box.height), 0)

  var fraction = 1 - (Math.abs(top + bottom) / box.height)
  if (fraction < 0) fraction = 0
  else if (fraction > 1) fraction = 1

  if (fraction === 1 && el.style.getPropertyValue('--inview') !== '1') {
    window.requestAnimationFrame(cb)
  }

  el.style.setProperty('--inview', fraction.toFixed(3))
}

// expose relative mouse coordinates as custom variables
// HTMLElement -> void
exports.mousemove = mousemove
function mousemove (el) {
  var enterTop = 0
  var enterLeft = 0
  var {offsetWidth, offsetHeight} = el
  var onmousemove = nanoraf(function (event) {
    var left = ((event.layerX - enterLeft) / offsetWidth).toFixed(2)
    var top = ((event.layerY - enterTop) / offsetHeight).toFixed(2)
    el.style.setProperty('--mouse-x', left)
    el.style.setProperty('--mouse-y', top)
  })

  el.addEventListener('mousemove', onmousemove)
  el.addEventListener('mouseleave', onmouseleave)
  el.addEventListener('mouseenter', onmouseenter)

  return function () {
    el.removeEventListener('mousemove', onmousemove)
    el.removeEventListener('mouseleave', onmouseleave)
    el.removeEventListener('mouseenter', onmouseenter)
  }

  function onmouseenter (event) {
    enterTop = event.layerY
    enterLeft = event.layerX
  }

  function onmouseleave (event) {
    if (event.target !== el) return
    enterTop = enterLeft = 0
    el.style.removeProperty('--mouse-x')
    el.style.removeProperty('--mouse-y')
  }
}

// walk DOM upwards calulating offset top
// (HTMLElement) -> num
exports.offset = offset
function offset (el) {
  var top = el.offsetTop
  var next = el
  while ((next = next.offsetParent)) {
    if (!isNaN(next.offsetTop)) top += next.offsetTop
  }
  return top
}

// observe how much of an element is in view
// (HTMLElement, fn) -> fn
exports.observe = observe
function observe (el, cb) {
  cb = cb || function () {}

  assert(el instanceof window.HTMLElement, 'base: el should be a DOM node')
  assert(typeof cb === 'function', 'base: cb should be a function')

  var index = cache.findIndex((item) => item[0] === el)
  if (index === -1) {
    index = cache.push([el, {top: offset(el), height: el.offsetHeight}, cb]) - 1
  }

  inview(cache[index])

  return nanoraf(function () {
    cache.splice(cache.findIndex((item) => item[0] === el), 1)
  })
}

// get viewport height
// () -> num
exports.vh = vh
function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

// get viewport width
// () -> num
exports.vw = vw
function vw () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}

// initialize translation utility with given language file
// obj -> str
exports.i18n = i18n
function i18n (source) {
  source = source || common

  // get text by applying as tagged template literal i.e. text`Hello ${str}`
  // (arr|str[, ...str]) -> str
  return function (strings, ...parts) {
    parts = parts || []

    var key = Array.isArray(strings) ? strings.join('%s') : strings
    var value = source[key] || common[key]

    if (!value) {
      value = common[key] = key
      if (typeof window === 'undefined') {
        var file = path.join(__dirname, 'lang.json')
        fs.writeFileSync(file, JSON.stringify(common, null, 2))
      }
    }

    return value
  }
}

// modulate value in range (from Framer.js)
// (num, arr, arr, bool) -> num
exports.modulate = modulate
function modulate (value, rangeA, rangeB, limit = false) {
  var [fromLow, fromHigh] = rangeA
  var [toLow, toHigh] = rangeB
  var result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) { return toLow }
      if (result > toHigh) { return toHigh }
    } else {
      if (result > toLow) { return toLow }
      if (result < toHigh) { return toHigh }
    }
  }

  return result
}

// test wether css rule is supported
// str -> bool
exports.supports = supports
function supports (rule) {
  var id = `_${(new Date() % 9e6).toString(36)}`
  var el = html`<div id="${id}"></div>`
  var style = html`
    <style>
      @supports (${rule}) {
        #${id}::before {
          content: "${id}";
        }
      }
    </style>
  `
  document.head.appendChild(style)
  document.body.appendChild(el)

  var result
  try {
    var computedPseudoStyle = window.getComputedStyle(el, ':before')
    var pseudoContentValue = computedPseudoStyle.getPropertyValue('content')
    result = pseudoContentValue.indexOf(id) !== -1
  } catch (err) {
    result = false
  }

  style.parentElement.removeChild(style)
  el.parentElement.removeChild(el)
  return result
}

var MEMO = new LRU()

// momize function
// (fn, arr) -> any
exports.memo = memo
function memo (fn, keys) {
  assert(Array.isArray(keys) && keys.length, 'memo: keys should be non-empty array')
  var key = JSON.stringify(keys)
  var result = MEMO.get(key)
  if (!result) {
    result = fn.apply(undefined, keys)
    MEMO.set(key, result)
  }
  return result
}

// compose srcset attribute from url for given sizes
// (str, arr, obj?) -> str
exports.srcset = srcset
function srcset (uri, sizes, opts = {}) {
  var type = opts.type || 'fetch'
  var transforms = opts.transforms
  if (!transforms) transforms = 'c_fill,f_auto,q_auto'
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/f_/.test(transforms)) transforms += ',f_auto'
  if (!/q_/.test(transforms)) transforms += ',q_auto'

  // trim prismic domain from uri
  var parts = uri.split('codeandconspire.cdn.prismic.io/codeandconspire/')
  uri = parts[parts.length - 1]

  return sizes.map(function (size) {
    var transform = transforms
    if (Array.isArray(size)) {
      transform = opts.transform ? size[1] + ',' + opts.transforms : size[1]
      if (!/c_/.test(transform)) transform += ',c_fill'
      if (!/f_/.test(transform)) transform += ',f_auto'
      if (!/q_/.test(transform)) transform += ',q_auto'
      size = size[0]
    }
    if (opts.aspect) transform += `,h_${Math.floor(size * opts.aspect)}`

    return `/media/${type}/${transform},w_${size}/${uri} ${size}w`
  }).join(',')
}
