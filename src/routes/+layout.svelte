<script>
  import '../app.css'
  import { onMount } from 'svelte'
  import { dev } from '$app/environment'
  import { afterNavigate, invalidateAll } from '$app/navigation'
  import { page } from '$app/state'
  import { PrismicPreview } from '@prismicio/svelte/kit'
  import { repositoryName, getBrowserPreviewRef } from '$lib/prismicio.js'

  let { children } = $props()

  const GA_ID = 'G-B8MM2HGXEV'

  // Load Google Analytics (ported from lib/document.js) — production only.
  onMount(() => {
    // Clean up the previous site's service worker and its caches. The old
    // (Choo/Jalla) site registered a caching worker at /sw.js; that URL now
    // 404s (which unregisters on the browser's update check) and this removes
    // it immediately for visitors who reach the new app code first.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
        .catch(() => {})
    }
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {})
    }

    // If we entered the page with an active Prismic preview session, the
    // prerendered loads used published content — re-run them so the browser
    // client picks up the preview ref and renders draft content.
    if (getBrowserPreviewRef()) invalidateAll()

    if (dev) return
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID)
  })

  // Page tracking on navigation (ported from stores/tracking.js).
  afterNavigate(() => {
    if (dev || typeof window === 'undefined' || typeof window.gtag !== 'function') return
    window.gtag('config', GA_ID, {
      page_title: page.data?.meta?.title,
      page_path: page.url.pathname
    })
  })
</script>

{@render children()}

<PrismicPreview {repositoryName} />
