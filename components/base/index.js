const fs = require('fs')
const path = require('path')
const assert = require('assert')
const html = require('choo/html')
const nanoraf = require('nanoraf')
const LRU = require('nanolru')
const common = require('./lang.json')

if (typeof window !== 'undefined') {
  require('smoothscroll-polyfill').polyfill()
}

const cache = []
if (typeof window !== 'undefined') {
  window.addEventListener('resize', nanoraf(function () {
    for (let i = 0, len = cache.length, el; i < len; i++) {
      el = cache[i][0]
      cache[i][1] = { top: el.offsetTop, height: el.offsetHeight }
      inview(cache[i])
    }
  }))
  window.addEventListener('scroll', nanoraf(function () {
    for (let i = 0, len = cache.length; i < len; i++) inview(cache[i])
  }), { passive: true })
}

// inspect element position relative to scroll offset
// arr -> void
function inview ([el, box, cb]) {
  const viewport = vh()
  const scroll = window.scrollY
  const top = Math.max(scroll - box.top, 0)
  const bottom = Math.min((scroll + viewport) - (box.top + box.height), 0)

  let fraction = 1 - (Math.abs(top + bottom) / box.height)
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
  let enterTop = 0
  let enterLeft = 0
  const { offsetWidth, offsetHeight } = el
  const onmousemove = nanoraf(function (event) {
    const left = ((event.layerX - enterLeft) / offsetWidth).toFixed(2)
    const top = ((event.layerY - enterTop) / offsetHeight).toFixed(2)
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
  let top = el.offsetTop
  let next = el
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

  let index = cache.findIndex((item) => item[0] === el)
  if (index === -1) {
    index = cache.push([el, { top: offset(el), height: el.offsetHeight }, cb]) - 1
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

    const key = Array.isArray(strings) ? strings.join('%s') : strings
    let value = source[key] || common[key]

    if (!value) {
      value = common[key] = key
      if (typeof window === 'undefined') {
        const file = path.join(__dirname, 'lang.json')
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
  const [fromLow, fromHigh] = rangeA
  const [toLow, toHigh] = rangeB
  const result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

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
  const id = `_${(new Date() % 9e6).toString(36)}`
  const el = html`<div id="${id}"></div>`
  const style = html`
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

  let result
  try {
    const computedPseudoStyle = window.getComputedStyle(el, ':before')
    const pseudoContentValue = computedPseudoStyle.getPropertyValue('content')
    result = pseudoContentValue.indexOf(id) !== -1
  } catch (err) {
    result = false
  }

  style.parentElement.removeChild(style)
  el.parentElement.removeChild(el)
  return result
}

const MEMO = new LRU()

// momize function
// (fn, arr) -> any
exports.memo = memo
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

// compose src attribute from url for a given size
// (str, num, obj?) -> str
exports.src = src
function src (uri, size) {
  const q = (size > 1000) ? 'q_50' : 'q_60'
  const transforms = `c_fill,f_auto,${q}`

  // trim prismic domain from uri
  const parts = uri.split('thenewdivision.cdn.prismic.io/thenewdivision/')
  uri = parts[parts.length - 1]

  return `/media/fetch/${transforms ? transforms + ',' : ''}w_${size}/${uri}`
}

// compose srcset attribute from url for given sizes
// (str, arr, obj?) -> str
exports.srcset = srcset
function srcset (uri, sizes) {
  return sizes.map(function (size) {
    return `${src(uri, size)} ${size}w`
  }).join(',')
}
