<script>
  import '../app.css'
  import { onMount } from 'svelte'
  import { dev } from '$app/environment'
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import { PrismicPreview } from '@prismicio/svelte/kit'
  import { repositoryName } from '$lib/prismicio.js'

  let { children } = $props()

  const GA_ID = 'G-B8MM2HGXEV'

  // Load Google Analytics (ported from lib/document.js) — production only.
  onMount(() => {
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
