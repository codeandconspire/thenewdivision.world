<script>
  import RichText from './RichText.svelte'
  import Logo from './Logo.svelte'
  // Ported from components/reel/index.js
  let { items = [], delay = null, title = null, clients = null, light = false } = $props()
</script>

<div class="Reel" style="--Reel-count: {items.length}; --Reel-delay: {delay ? delay : '4.0'}s;">
  {#if title}<h1 class="u-hiddenVisually">{title}</h1>{/if}
  {#each items as item}
    <div class="Reel-item">
      <div class="Reel-quote"><RichText field={item.quote} /></div>
      {#if item.clientId}
        <div class="Reel-client"><Logo id={item.clientId} {clients} dark={light} small /></div>
      {/if}
      <p class="Reel-author">
        <strong>{item.author}</strong>
        <br />
        {item.desc}
      </p>
    </div>
  {/each}
</div>
