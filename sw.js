/* eslint-env serviceworker */

const TRACKING_REGEX = /https?:\/\/((www|ssl)\.)?google-analytics\.com/
const BUILD_VERSION = '1.0.0'
const PRISMIC_ENDPOINT = 'https://thenewdivision.cdn.prismic.io'
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const FILES = [
  '/'
]

self.addEventListener('install', function oninstall (event) {
  event.waitUntil(
    caches
      .open(BUILD_VERSION)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', function onactivate (event) {
  event.waitUntil(clear().then(() => self.clients.claim()))
})

self.addEventListener('fetch', function onfetch (event) {
  const req = event.request
  const url = new self.URL(req.url)
  const isHTML = req.headers.get('accept').includes('text/html')

  event.respondWith(
    caches.open(BUILD_VERSION).then(cache => {
      return cache.match(req).then(cached => {
        const isLocal = self.location.origin === url.origin
        const isCMS = url.href.indexOf(PRISMIC_ENDPOINT) === 0

        // always bypass cache for requests to application APIs
        if ((isHTML && isLocal) || isCMS || IS_DEVELOPMENT) {
          return update(cached)
        }

        // bypass cache for tracking scripts
        if (TRACKING_REGEX.test(url.href)) return self.fetch(req)

        // Use cached response
        return cached || update()
      })

      function update (fallback) {
        if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') {
          return fallback
        }

        return self.fetch(req).then(response => {
          if (!response.ok && fallback) return fallback
          cache.put(req, response.clone())
          return response
        })
      }
    })
  )
})

function clear () {
  return caches.keys().then(keys => {
    return Promise.all(keys.map(key => caches.delete(key)))
  })
}
