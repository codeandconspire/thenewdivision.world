<script>
  import { transform } from '$lib/image.js'
  import { asText } from '$lib/prismic.js'
  import { className } from '$lib/utils.js'

  // Ported from Clients.logos (components/clients/index.js)
  let { id, clients = null, dark = false, small = false, large = false } = $props()

  const client = $derived(clients ? clients.find((c) => c.id === id) : undefined)

  const logo = $derived.by(() => {
    if (!client) return null
    const data = client.data
    const hasLight = data.logo_light?.length || data.logo_light?.url
    const hasDark = data.logo_dark?.length || data.logo_dark?.url
    let selected
    if ((dark && hasDark) || !hasLight) selected = data.logo_dark
    else selected = data.logo_light
    return selected && selected.url ? selected : null
  })

  const wrapClass = $derived(className('Clients', { 'Clients--small': small, 'Clients--large': large }))
  const titleText = $derived(client?.data?.title ? asText(client.data.title) : '')
</script>

{#if !clients}
  <div class={wrapClass}>
    <div class="Clients-item">
      <div class="Clients-loading"></div>
    </div>
  </div>
{:else if logo}
  <div class={wrapClass} style="--Clients-size: {(logo.dimensions.height / logo.dimensions.width).toFixed(2)};">
    <div class="Clients-item">
      <img
        class="Clients-img"
        width={logo.dimensions.width}
        height={logo.dimensions.height}
        draggable="false"
        alt={titleText}
        title={titleText || undefined}
        src={transform(logo.url)}
      />
    </div>
  </div>
{/if}
