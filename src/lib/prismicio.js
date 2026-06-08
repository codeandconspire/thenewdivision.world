import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/svelte/kit'

export const repositoryName = 'thenewdivision'

// Prismic locale codes keyed by the URL language segment used on the site.
export const LANGUAGE_CODES = { en: 'en-us', sv: 'sv-se' }

/**
 * Create a Prismic client. Pass `fetch` (and `cookies` on the server) from a
 * SvelteKit load function. In the browser an active preview session is picked
 * up from the cookie so `invalidateAll()` re-fetches draft content.
 */
export function createClient ({ fetch, cookies, ...config } = {}) {
  const client = prismic.createClient(repositoryName, {
    fetch,
    ...config
  })

  if (cookies) {
    enableAutoPreviews({ client, cookies })
  } else {
    const ref = getBrowserPreviewRef()
    if (ref) client.queryContentFromRef(ref)
  }

  return client
}

// Read an active Prismic preview ref from document.cookie (browser only).
function getBrowserPreviewRef () {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)io\.prismic\.preview=([^;]+)/)
  if (!match) return undefined
  const value = decodeURIComponent(match[1])
  return /\.prismic\.io/.test(value) ? value : undefined
}
