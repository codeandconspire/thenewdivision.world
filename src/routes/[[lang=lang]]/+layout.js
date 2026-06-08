import { createClient, LANGUAGE_CODES } from '$lib/prismicio.js'

export async function load ({ params }) {
  const language = params.lang || 'en'
  const lang = LANGUAGE_CODES[language] || 'en-us'
  // Global fetch (not SvelteKit's) — see note in [...uid]/+page.js.
  const client = createClient()

  const [setting, clients] = await Promise.all([
    client.getSingle('setting', { lang }).catch(() => null),
    client.getAllByType('client', { lang, pageSize: 100 }).catch(() => [])
  ])

  return { language, setting, clients }
}
