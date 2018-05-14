const fs = require('fs')
const path = require('path')
const css = require('sheetify')
const assert = require('assert')
const nanoraf = require('nanoraf')
const common = require('./lang.json')

css('normalize.css')
css('./transitions')
css('./display')
css('./loading')
css('./layout')
css('./colors')
css('./space')
css('./size')
css('./text')
css('./index')

if (typeof window !== 'undefined') {
  require('smoothscroll-polyfill').polyfill()
}

const cache = []
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
  const {offsetWidth, offsetHeight} = el
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

// observe how much of an element is in view
// (HTMLElement, fn) -> fn
exports.observe = observe
function observe (el, cb) {
  cb = cb || function () {}

  assert(el instanceof window.HTMLElement, 'base: el should be a DOM node')
  assert(typeof cb === 'function', 'base: cb should be a function')

  let index = cache.findIndex((item) => item[0] === el)
  if (index === -1) {
    let top = el.offsetTop
    let next = el
    while ((next = next.offsetParent)) {
      if (!isNaN(next.offsetTop)) top += next.offsetTop
    }
    index = cache.push([el, {top: top, height: el.offsetHeight}, cb]) - 1
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
