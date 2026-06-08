import * as prismic from '@prismicio/client'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export function GET ({ cookies }) {
  cookies.delete(prismic.cookie.preview, { path: '/' })
  redirect(307, '/')
}
