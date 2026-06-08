<script>
  import A from './A.svelte'
  import Figure from './Figure.svelte'
  import Logo from './Logo.svelte'
  // Ported from components/enterence/index.js
  let { title = null, clientId = null, image = null, link = null, color = 'dark', label = null, small = false, clients = null, light = false } = $props()
</script>

<div class="Enterence {small ? 'Enterence--small' : ''}">
  <div class="Enterence-figure">
    <Figure {image} half={small} />
    {#if label}<span class="Enterence-label Enterence-label--{color}">{label}</span>{/if}
  </div>
  <div class="Enterence-meta">
    <div class="Enterence-title">
      <A {link} class="Enterence-link">{title}</A>
    </div>
    {#if clientId}
      <div class="Enterence-client"><Logo id={clientId} {clients} dark={light} {small} /></div>
    {/if}
  </div>
</div>
