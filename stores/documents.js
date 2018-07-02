var assert = require('assert')
var html = require('choo/html')
var {getApi, Predicates} = require('prismic-javascript')

module.exports = documents

var endpoint = getApi('https://thenewdivision.cdn.prismic.io/api/v2')

function documents (state, emitter) {
  state.documents = {
    error: null,
    loading: false,
    resolve: resolve,
    items: state.documents && !state.prefetch ? [...state.documents.items] : []
  }
  state.ref = state.ref || 'https://thenewdivision.prismic.io/previews/WzouISAAANV3f581'

  var queue = 0
  emitter.on('doc:fetch', function (query, opts = {}) {
    if (typeof window === 'undefined') {
      endpoint = getApi('https://thenewdivision.cdn.prismic.io/api/v2')
      if (state.prefetch) state.prefetch.push(api(query))
    } else {
      api(query).then(done, done)
    }

    function done () {
      if (!opts.silent) render()
    }
  })

  // preemtively fetch homepage
  if (state.prefetch) {
    state.prefetch.push(api({type: 'homepage'}), api({type: 'about'}))
  }

  function api (query) {
    if (!query.id) assert.equal(typeof query.type, 'string', 'documents: type should be a string')

    var opts = {}
    var predicates = []
    if (state.ref) opts.ref = state.ref

    // default to fetching primary case fields
    if (query.fetchLinks) opts.fetchLinks = query.fetchLinks
    else opts.fetchLinks = ['case.title', 'case.description', 'case.image']

    if (query.id) {
      predicates.push(Predicates.at('document.id', query.id))
    }

    if (query.type) {
      if (query.uid) {
        predicates.push(Predicates.at(`my.${query.type}.uid`, query.uid))
      } else {
        predicates.push(Predicates.at('document.type', query.type))
      }
    }

    assert(predicates.length, 'documents: could not construct predicates')

    queue += 1
    state.documents.loading = true
    return endpoint.then(function (api) {
      return api.query(predicates, opts).then(function (response) {
        if (typeof window !== 'undefined') response.results.forEach(preload)
        state.documents.items.push(...response.results.filter(function (doc) {
          return !state.documents.items.find((existing) => existing.id === doc.id)
        }))
      })
    }).catch(function (err) {
      state.documents.error = new DocumentError(err)
    }).then(function () {
      queue -= 1
      if (queue === 0) state.documents.loading = false
    })
  }

  // preload critical images in document
  // obj -> void
  function preload (doc) {
    if (doc.type === 'homepage') {
      doc.data.featured_cases.forEach(function (props) {
        html`<img src="${props.image.url}">`
        if (props.case.data.image) html`<img src="${props.case.data.image.url}">`
      })
    } else if (doc.type === 'case') {
      html`<img src="${doc.data.image.url}">`
    }
  }

  // utility function for emitting a render event
  function render () {
    emitter.emit('render')
  }

  // keep state serializable by stripping out resolve
  resolve.toJSON = function () {
    return null
  }

  // resolve href to document
  // obj -> str
  function resolve (doc) {
    switch (doc.type) {
      case 'homepage': return '/'
      case 'about': return '/about'
      case 'case': return `/${doc.uid}`
      default: return '/404'
    }
  }
}

class DocumentError extends Error {
  constructor (err, ...args) {
    if (err instanceof Error) super(err.message, ...args)
    else super(err, ...args)

    if (Error.captureStackTrace) Error.captureStackTrace(this, DocumentError)

    this.name = 'DocumentError'
  }

  toJSON () {
    var props = {
      name: this.name,
      message: this.message
    }

    if (process.env.NODE_ENV === 'development') props.stack = this.stack

    return props
  }
}
