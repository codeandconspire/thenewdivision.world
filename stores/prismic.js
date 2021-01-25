const LRU = require('nanolru')
const assert = require('assert')
const html = require('choo/html')
const Prismic = require('prismic-javascript')

const REPOSITORY = 'https://allaboard.cdn.prismic.io/api/v2'

module.exports = prismicStore

function prismicStore (opts) {
  opts = opts || {}

  let cache
  if (typeof opts.lru === 'number') cache = new LRU(opts.lru)
  else cache = opts.lru || new LRU(100)
  const middleware = opts.middleware

  return function (state, emitter) {
    // clear cache on SSR prefetch
    if (typeof window === 'undefined' && state.prefetch) {
      cache.clear()
    }

    // expose clear via event
    emitter.on('prismic:clear', function () {
      cache.clear()
    })

    emitter.on('DOMContentLoaded', function () {
      if (document.cookie.includes(Prismic.previewCookie)) {
        document.head.appendChild(html`<script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=allaboard"></script>`)
      }
    })

    // parse SSR-provided initial state
    if (state.prismic) {
      assert(typeof state.prismic === 'object', 'choo-prismic: state.prismic should be type object')
      const cachekeys = Object.keys(state.prismic)
      for (let i = 0, len = cachekeys.length, val; i < len; i++) {
        val = state.prismic[cachekeys[i]]
        cache.set(cachekeys[i], val)
      }
    }

    // instantiate api
    const api = Prismic.getApi(REPOSITORY, { req: state.req })
    if (state.prefetch) state.prefetch.push(api)

    // query prismic endpoint with given predicate(s)
    // (str|arr, obj?, fn) -> any
    function get (predicates, opts, callback) {
      assert(predicates, 'choo-prismic: predicates should be type array or string')

      // parse arguments
      predicates = Array.isArray(predicates) ? predicates : [predicates]
      callback = typeof opts === 'function' ? opts : callback
      opts = typeof opts === 'function' ? {} : opts
      callback = callback || Function.prototype

      // pass input through middleware
      let transform
      if (typeof middleware === 'function') {
        transform = middleware(predicates, opts)
      }

      // pluck out prefetch from opts
      const prefetch = state.prefetch || opts.prefetch
      const cb = opts.render || render
      opts = Object.assign({}, opts)
      delete opts.prefetch
      delete opts.render

      // compile cache key and lookup cached request
      let key = predicates.join(',')
      const optkeys = Object.keys(opts).sort()
      for (let i = 0, len = optkeys.length; i < len; i++) {
        key += (',' + optkeys[i] + '=' + JSON.stringify(opts[optkeys[i]]))
      }
      const cached = cache.get(key)

      let result
      if (!cached) {
        result = callback(null)
      } else if (cached instanceof Error) {
        return callback(cached)
      } else if (cached instanceof Promise) {
        // issue render if a non-prefetch request caught up to a prefetch
        if (cached._prefetch && !prefetch) cached.then(render, render)
        return callback(null, null)
      } else if (cached) {
        return callback(null, cached)
      }

      // perform query
      const request = api.then(function (api) {
        return api.query(predicates, opts)
      }).then(function (response) {
        // optionally transform the response using registered middleware
        if (typeof transform === 'function') return transform(null, response)
        return response
      }).then(function (response) {
        cache.set(key, response)
        emitter.emit('prismic:response', response)
        if (!prefetch && typeof window !== 'undefined') cb(null, response)
        return response
      }).catch(function (err) {
        cache.set(key, err)
        emitter.emit('prismic:error', err)
        if (!prefetch && typeof window !== 'undefined') cb(err)
        // forward error to transform or just throw it
        if (typeof transform === 'function') {
          try {
            return transform(err)
          } catch (err) {
            if (state.prefetch) throw err
          }
        } else if (state.prefetch) {
          throw err
        }
      })

      // tag request as beeing a prefetch
      request._prefetch = Boolean(prefetch)

      // cache pending request
      cache.set(key, request)
      emitter.emit('prismic:request', request)

      // defer to callback to allow for nested queries
      if (state.prefetch) state.prefetch.push(chain(request, callback))

      return result
    }

    // emit render event
    // () ->
    function render () {
      emitter.emit('render')
    }

    // get single document by uid
    // (str, str, obj?, fn) -> any
    function getByUID (type, uid, opts, callback) {
      assert(typeof type === 'string', 'choo-prismic: type should be type string')
      assert(typeof uid === 'string', 'choo-prismic: uid should be type string')
      callback = typeof opts === 'function' ? opts : callback
      opts = typeof opts === 'function' ? {} : opts
      const path = 'my.' + type + '.uid'
      return get(Prismic.Predicates.at(path, uid), opts, first(callback))
    }

    // get single document by id
    // (str, obj?, callback)
    function getByID (id, opts, callback) {
      assert(typeof id === 'string', 'choo-prismic: id should be type string')
      callback = typeof opts === 'function' ? opts : callback
      opts = typeof opts === 'function' ? {} : opts
      return get(Prismic.Predicates.at('document.id', id), opts, first(callback))
    }

    // get documents by id
    // (arr, obj?, fn) -> any
    function getByIDs (ids, opts, callback) {
      assert(Array.isArray(ids), 'choo-prismic: ids should be type array')
      callback = typeof opts === 'function' ? opts : callback
      opts = typeof opts === 'function' ? {} : opts
      return get(Prismic.Predicates.in('document.id', ids), opts, callback)
    }

    // get single document by type
    // (str, obj?, fn) -> any
    function getSingle (type, opts, callback) {
      assert(typeof type === 'string', 'choo-prismic: type should be type string')
      callback = typeof opts === 'function' ? opts : callback
      opts = typeof opts === 'function' ? {} : opts
      return get(Prismic.Predicates.at('document.type', type), opts, first(callback))
    }

    state.prismic = Object.create({
      get: get,
      cache: cache,
      getByID: getByID,
      getByIDs: getByIDs,
      getByUID: getByUID,
      getSingle: getSingle,
      toJSON () {
        const json = {}
        for (let i = 0, value; i < cache.keys.length; i++) {
          value = cache.get(cache.keys[i])
          // guard against unfinshed promises being stringified as empty object
          if (!(value instanceof Promise)) json[cache.keys[i]] = value
        }
        return json
      }
    })
  }
}

// pluck out first document from result
// fn -> fn
function first (callback) {
  // return no-op in place of callback
  if (!callback) return Function.prototype
  return function onresponse (err, response) {
    if (err) return callback(err)
    if (!response) return callback(null)
    if (!response.results || !response.results.length) {
      err = new Error(
        response.results ? 'Document not found' : 'An error occured'
      )
      err.status = response.status || 404
      return callback(err)
    }
    return callback(null, response.results[0])
  }
}

// chain a callback function onto a promise
// (Promise, fn) -> Promise
function chain (promise, fn) {
  return promise.then(function (value) {
    return fn(null, value)
  }, fn)
}
