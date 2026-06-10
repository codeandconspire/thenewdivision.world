import { NotFoundError } from '@prismicio/client'
import { error } from '@sveltejs/kit'
import { createClient, LANGUAGE_CODES } from '$lib/prismicio.js'
import { asText } from '$lib/prismic.js'
import { src } from '$lib/image.js'

export async function load ({ params }) {
  const language = params.lang || 'en'
  const lang = LANGUAGE_CODES[language] || 'en-us'
  const uid = params.uid ? params.uid : 'home'
  // Use the global fetch (not SvelteKit's) so the Prismic client doesn't replay
  // SvelteKit's inlined fetch cache, which corrupts the response on back/forward
  // navigation to prerendered pages.
  const client = createClient()

  let doc
  try {
    doc = await client.getByUID('page', uid, { lang })
  } catch (err) {
    if (err instanceof NotFoundError) error(404, 'Page not found')
    throw err
  }

  // Theme (ported from views/page.js#getOpts)
  const theme = {
    background: doc.data.light ? '#ffffff' : '#010101',
    color: doc.data.light ? '#000000' : '#ffffff',
    themed: false
  }
  if (doc.data.theme) {
    theme.themed = true
    if (doc.data.background) theme.background = doc.data.background
    if (doc.data.color) theme.color = doc.data.color
  }

  // Meta (ported from views/page.js#meta)
  const meta = {
    title: uid === 'home' ? null : asText(doc.data.title),
    description: asText(doc.data.description)
  }
  const share = doc.data.share
  if (share && share.url) {
    meta.image = src(share.url, 1200)
    meta.imageWidth = 1200
    meta.imageHeight = Math.round((1200 * share.dimensions.height) / share.dimensions.width)
  }

  return { page: doc, uid, light: doc.data.light, theme, meta }
}

// Enumerate every page UID (all languages) so the static build prerenders them.
export async function entries () {
  const client = createClient({})
  const pages = await client.getAllByType('page', { lang: '*' })
  return pages.map((doc) => ({
    lang: doc.lang === 'en-us' ? '' : doc.lang.substring(0, 2),
    uid: doc.uid === 'home' ? '' : doc.uid
  }))
}
