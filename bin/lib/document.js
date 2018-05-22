var minifier = require('posthtml-minifier')
var posthtmlify = require('posthtmlify')
var documentify = require('documentify')
var hyperstream = require('hstream')

module.exports = document

function document (html, state, app) {
  var selector = require(app.entry).selector || 'body'
  var d = documentify(`
    <!doctype html>
    <html lang="${state.language || 'en'}">
    <head></head>
    <body></body>
    </html>
  `)

  if (state.ui.theme === 'sand') {
    // TODO: figure put ergonomic api for this
    d.transform(function () {
      return hyperstream({html: {class: 'u-themeSand'}})
    })
  }

  d.transform(function () {
    return hyperstream({[selector]: {_replaceHtml: html}})
  })

  if (state.title) {
    d.transform(addToHead, `<title>${state.title.trim().replace(/\n/g, '')}</title>`)
  }
  d.transform(addToHead, '<meta name="viewport" content="width=device-width, initial-scale=1">')
  d.transform(addToHead, '<meta name="theme-color" content="#fff" property="theme">')
  d.transform(addToHead, '<meta name="twitter:card" content="summary_large_image">')
  d.transform(addToHead, `<meta property="og:title" content="${state.meta.title}">`)
  d.transform(addToHead, `<meta property="description" content="${state.meta.description}">`)
  d.transform(addToHead, `<meta property="og:image" content="${state.meta.image}">`)
  d.transform(addToHead, `<meta property="og:url" content="https://www.thenewdivision.world${state.href}">`)

  d.transform(addToHead, `<script>window.initialState = ${stringify(state)}</script>`)

  if (app.env === 'development') {
    d.transform(addToHead, `
      <script src="/dev/bundle.js" defer></script>
      <link rel="stylesheet" href="/dev/bundle.css">
    `)
  } else {
    if (app.context.style) {
      // TODO: Add inline critical css
      // TODO: submit PR with custom filter to https://github.com/stackcss/inline-critical-css
    }

    d.transform(addToHead, `
      <script src="/${app.context.script.hash.toString('hex').slice(0, 16)}/bundle.js" integrity="sha512-${app.context.script.hash.toString('base64')}" defer></script>
      <link rel="stylesheet" href="/${app.context.style.hash.toString('hex').slice(0, 16)}/bundle.css">
    `)
    d.transform(posthtmlify, {use: [minifier], order: 'end'})
  }

  return d.bundle()
}

function stringify (obj) {
  return JSON.stringify(obj)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function addToHead (str) {
  return hyperstream({head: {_appendHtml: str}})
}
