import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Only the preview endpoints are dynamic; everything else is static, so
    // route just /api/* to the Cloudflare Function (avoids the _routes.json
    // exclude-rule limit warning from listing every prerendered page).
    adapter: adapter({
      routes: {
        include: ['/api/*'],
        exclude: []
      }
    }),
    // Prerender the whole site as static HTML. A Prismic webhook hits a
    // Cloudflare Pages deploy hook to rebuild when content changes.
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    }
  }
}

export default config
