<script>
  import { page as appPage } from '$app/state'
  import { createTranslate } from '$lib/i18n.js'
  import Slices from '$lib/components/Slices.svelte'

  let { data } = $props()

  const SITE_NAME = 'The New Division'
  const ORIGIN = 'https://www.thenewdivision.world'

  const text = $derived(createTranslate(data.language ?? appPage.data.language))
  const setting = $derived(appPage.data.setting)
  const doc = $derived(data.page)

  const title = $derived.by(() => {
    const m = data.meta
    if (m.title && m.title !== SITE_NAME) {
      return `${m.title.replace(/\.$/, '')} – ${SITE_NAME}`
    }
    return `${SITE_NAME} – ${setting?.data?.fallback_title || text`Loading`}`
  })

  // og:image — page share, else the global setting share (ported from view).
  const share = $derived.by(() => {
    if (data.meta.image) {
      return { url: data.meta.image, width: data.meta.imageWidth, height: data.meta.imageHeight }
    }
    const s = setting?.data?.share
    if (s && s.url) return { url: s.url, width: s.dimensions?.width, height: s.dimensions?.height }
    return null
  })

  const canonical = $derived(ORIGIN + appPage.url.pathname)
</script>

<svelte:head>
  <title>{title}</title>
  {#if data.meta.description}
    <meta name="description" content={data.meta.description} />
    <meta property="og:description" content={data.meta.description} />
    <meta name="twitter:description" content={data.meta.description} />
  {/if}
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />
  <meta property="og:url" content={canonical} />
  <link rel="canonical" href={canonical} />
  {#if share}
    <meta property="og:image" content={share.url} />
    <meta name="twitter:image" content={share.url} />
    {#if share.width}<meta property="og:image:width" content={share.width} />{/if}
    {#if share.height}<meta property="og:image:height" content={share.height} />{/if}
  {/if}
</svelte:head>

<div class="u-container">
  <Slices
    slices={doc.data.body}
    light={doc.data.light}
    clients={appPage.data.clients}
    language={data.language ?? appPage.data.language}
    uid={data.uid}
    {text}
  />
</div>
