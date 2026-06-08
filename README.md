# The New Division

Website for The New Division — [www.thenewdivision.world](https://www.thenewdivision.world)

## Stack

- **SvelteKit** (Svelte 5) + **Vite**
- **Prismic** CMS (`@prismicio/client` / `@prismicio/svelte`), repo `thenewdivision`
- Deployed to **Cloudflare Pages** (`@sveltejs/adapter-cloudflare`), fully **prerendered** to static HTML
- Images transformed via **Cloudflare Image Transformations** (`/cdn-cgi/image/...`)

## Develop

```sh
npm install
npm run dev      # http://localhost:5173 — images load directly from Prismic
npm run build    # prerenders every page; output in .svelte-kit/cloudflare
npm run preview  # serve the production build locally
```

## Deployment (Cloudflare Pages)

- Build command: `npm run build` · Output dir: `.svelte-kit/cloudflare`
- **No environment variables are required** (the Prismic repo is public; images use URL transforms).
- **Prerequisite:** enable **Image Transformations** on the `thenewdivision.world` Cloudflare zone and allow transforming images from the `images.prismic.io` origin. Without it, `/cdn-cgi/image/...` URLs won't resolve.

### Content updates trigger a deploy

Content is prerendered, so publishing in Prismic must rebuild the site:

1. Cloudflare Pages → project → **Settings → Builds & deployments → Deploy hooks** → create a hook, copy the URL.
2. Prismic → **Settings → Webhooks** → add that URL.

Publishing any document then triggers a rebuild + deploy.

### Preview

Prismic preview works via `/api/preview` and `/api/exit-preview` (Cloudflare Functions) plus
`<PrismicPreview>`; draft content is fetched client-side when a preview session is active.

## Structure

- `src/routes/[[lang=lang]]/[...uid]/` — page route (English at `/`, Swedish under `/sv`)
- `src/lib/components/` — UI components (CSS reused verbatim under `src/styles/`)
- `src/lib/prismicio.js` — Prismic client · `src/lib/image.js` — Cloudflare image URLs
- `static/_redirects` — legacy URL redirects
