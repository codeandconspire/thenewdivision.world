<script>
  import { transform } from '$lib/image.js'
  import { asText } from '$lib/prismic.js'

  // Ported from Clients.list (components/clients/index.js) — the "logos" slice.
  let { clients = null, dark = false } = $props()

  function pickLogo (data) {
    const hasLight = data.logo_light?.length || data.logo_light?.url
    const hasDark = data.logo_dark?.length || data.logo_dark?.url
    let logo
    if ((dark && hasDark) || !hasLight) logo = data.logo_dark
    else logo = data.logo_light
    return logo && logo.url ? logo : null
  }

  const items = $derived.by(() => {
    if (!clients) return null
    return clients
      .filter((client) => !client.data.unlisted)
      .map((client) => ({ client, logo: pickLogo(client.data) }))
      .filter((item) => item.logo)
  })
</script>

{#if !clients}
  <div class="Clients Clients--large">
    <div class="Clients-list">
      <div class="Clients-item"><div class="Clients-loading"></div></div>
      <div class="Clients-item"><div class="Clients-loading"></div></div>
      <div class="Clients-item"><div class="Clients-loading"></div></div>
      <div class="Clients-item"><div class="Clients-loading"></div></div>
      <div class="Clients-item"><div class="Clients-loading"></div></div>
      <div class="Clients-item"><div class="Clients-loading"></div></div>
    </div>
  </div>
{:else}
  <div class="Clients Clients--large {clients.length % 2 ? 'Clients--odd' : ''}">
    <ul class="Clients-list">
      {#each items as { client, logo }}
        <li class="Clients-item" style="--Clients-size: {(logo.dimensions.height / logo.dimensions.width).toFixed(2)};">
          <img
            class="Clients-img"
            width={logo.dimensions.width}
            height={logo.dimensions.height}
            draggable="false"
            loading="lazy"
            alt={client.data.title ? asText(client.data.title) : ''}
            title={client.data.title ? asText(client.data.title) : undefined}
            src={transform(logo.url)}
          />
        </li>
      {/each}
    </ul>
  </div>
{/if}
