const fs = require('fs')
const path = require('path')
const css = require('sheetify')
const assert = require('assert')
const nanoraf = require('nanoraf')
const common = require('./lang.json')

css('normalize.css')
css('./display')
css('./layout')
css('./space')
css('./size')
css('./index')

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
    document.documentElement.style.setProperty('--scroll', window.scrollY)
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
  if (fraction === 1 && el.style.getPropertyValue('--inview') !== '1') cb()
  el.style.setProperty('--inview', fraction.toFixed(3))
}

// observe how much of an element is in view
// (HTMLElement, fn) -> fn
exports.observe = observe
function observe (el, cb) {
  assert(el instanceof window.HTMLElement, 'base: el should be a DOM node')

  let entry
  const onmousemove = nanoraf(function (event) {
    el.style.setProperty('--mouse-x', (event.layerX / entry[1].width).toFixed(2))
    el.style.setProperty('--mouse-y', (event.layerY / entry[1].height).toFixed(2))
  })

  let index = cache.findIndex((item) => item[0] === el)
  if (index === -1) {
    entry = [el, {
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight
    }, cb]
    index = cache.push(entry) - 1
    el.addEventListener('mousemove', onmousemove)
    el.addEventListener('mouseleave', onmouseleave)
  }

  inview(cache[index])

  return nanoraf(function () {
    cache.splice(cache.findIndex((item) => item[0] === el), 1)
    el.removeEventListener('mousemove', onmousemove)
    el.removeEventListener('mouseleave', onmouseleave)
  })

  function onmouseleave (event) {
    el.style.setProperty('--mouse-x', 0)
    el.style.setProperty('--mouse-y', 0)
  }
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
