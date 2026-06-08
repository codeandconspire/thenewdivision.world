<script>
  import { page } from '$app/state'
  import { createTranslate } from '$lib/i18n.js'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'

  let { data, children } = $props()

  const text = $derived(createTranslate(data.language))
  const setting = $derived(data.setting)
  const theme = $derived(page.data?.theme || {})

  // Languages available for the current document (ported from components/view).
  const languages = $derived(
    [setting?.lang]
      .concat((setting?.alternate_languages || []).map((l) => l.lang))
      .filter(Boolean)
      .map((l) => l.substring(0, 2))
  )

  const style = $derived(
    [
      theme.background ? `--color-background: ${theme.background}` : null,
      theme.color ? `--color-text: ${theme.color}` : null
    ]
      .filter(Boolean)
      .join('; ')
  )

  // Reflect the page theme on <html> and the browser chrome (ported from view).
  $effect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.style.cssText = style
    const meta = document.querySelector('[name="theme-color"]')
    if (meta && theme.background) meta.setAttribute('content', theme.background)
  })
</script>

<div class="View" {style}>
  {#if setting}
    <Header data={setting.data} href={page.url.pathname} language={data.language} {text} />
  {:else}
    <header class="Header u-container"></header>
  {/if}

  <main class="View-main">
    {@render children()}
  </main>

  {#if setting}
    <Footer
      data={setting.data}
      {languages}
      themed={theme.themed}
      language={data.language}
      {text}
    />
  {:else}
    <footer class="Footer"></footer>
  {/if}
</div>
