import { redirect } from '@sveltejs/kit'
import { legacyMediaUrl } from '$lib/image.js'

// Legacy image proxy URLs from the old Cloudinary-backed site
// (`/media/fetch/c_fill,...,w_170/<encoded prismic url>`) still arrive from
// search indexes, hotlinks and stale service worker caches. Redirect them
// permanently to the Cloudflare transformation equivalent.
export const prerender = false

export function GET ({ params, url }) {
  let uri = params.uri

  // The old proxy tolerated double-encoded query strings embedded by Prismic.
  try {
    if (!uri.includes('?') && /%3f/i.test(uri)) uri = decodeURIComponent(uri)
  } catch {
    // leave uri as-is
  }
  if (url.search) uri += (uri.includes('?') ? '&' : '?') + url.search.slice(1)

  const transform = params.transform === '_' ? null : params.transform

  // `fetch` type proxied a remote (Prismic) image — translate the transforms.
  if (/^https?:\/\//.test(uri)) {
    redirect(301, legacyMediaUrl(uri, transform))
  }

  // Anything else was a Cloudinary-hosted asset (`upload` type) — send it to
  // Cloudinary's public delivery URL.
  redirect(301, `https://res.cloudinary.com/dykmd8idd/image/${params.type}/${transform ? `${transform}/` : ''}${uri}`)
}
