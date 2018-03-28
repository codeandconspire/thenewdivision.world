const assert = require('assert')
const { getApi, Predicates } = require('prismic-javascript')

module.exports = documents

const endpoint = getApi('https://thenewdivision.cdn.prismic.io/api/v2')

function documents (state, emitter) {
  state.documents = {
    error: null,
    loading: false,
    items: state.documents ? [...state.documents.items] : []
  }

  let queue = 0
  emitter.on('doc:fetch', function (data) {
    if (typeof window === 'undefined') {
      if (state._experimental_prefetch) {
        state._experimental_prefetch.push(query(data))
      }
    } else {
      query(data).then(render, render)
    }
  })

  function render () {
    emitter.emit('render')
  }

  function query (data) {
    assert.equal(typeof data.type, 'string', 'documents: type should be a string')

    const opts = {}
    const predicates = []
    if (state.ref) opts.ref = state.ref

    if (data.uid) {
      predicates.push(Predicates.at(`my.${data.type}.uid`, data.uid))
    } else {
      predicates.push(Predicates.at('document.type', data.type))
    }

    assert(predicates.length, 'documents: could not construct predicates')

    queue += 1
    state.documents.loading = true
    return endpoint.then(function (api) {
      return api.query(predicates, opts).then(function (response) {
        state.documents.items.push(...response.results.filter(function (doc) {
          return !state.documents.items.find(existing => existing.id === doc.id)
        }))
      })
    }).catch(function (err) {
      state.documents.error = new DocumentError(err)
    }).then(function () {
      queue -= 1
      if (queue === 0) state.documents.loading = false
    })
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
    const props = {
      name: this.name,
      message: this.message
    }

    if (process.env.NODE_ENV === 'development') props.stack = this.stack

    return props
  }
}
