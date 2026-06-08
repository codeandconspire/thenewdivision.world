import * as prismic from '@prismicio/client'
import { redirect } from '@sveltejs/kit'
import { createClient } from '$lib/prismicio.js'
import { resolve } from '$lib/prismic.js'

// Dynamic endpoint (runs as a Cloudflare Function) — not prerendered.
export const prerender = false

export async function GET ({ url, cookies, fetch }) {
  const client = createClient({ fetch })
  const previewToken = url.searchParams.get('token') ?? undefined
  const documentID = url.searchParams.get('documentId') ?? undefined

  const redirectURL = await client.resolvePreviewURL({
    previewToken,
    documentID,
    linkResolver: resolve,
    defaultURL: '/'
  })

  if (previewToken) {
    // Readable by client JS so createClient() can pick up the preview ref.
    // SameSite=None + Secure is required so the cookie is accepted in the
    // cross-site context Prismic previews run in (the editor iframe / a
    // navigation referred from prismic.io). A Lax cookie is silently dropped
    // there — most visibly in Safari — leaving no preview ref to read.
    cookies.set(prismic.cookie.preview, previewToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'none',
      secure: true
    })
  }

  redirect(307, redirectURL)
}
