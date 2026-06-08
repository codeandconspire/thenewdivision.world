<script>
  import RichText from './RichText.svelte'
  import Logo from './Logo.svelte'
  // Ported from components/quotes/index.js
  let { items = [], clients = null, dark = false } = $props()
</script>

<div class="Quotes">
  {#each items as item}
    <div class="Quotes-item">
      {#if item.clientId}
        <div class="Quotes-client"><Logo id={item.clientId} {clients} {dark} large /></div>
      {/if}
      <div class="Quotes-content"><RichText field={item.content} /></div>
      <div class="Quotes-author"><RichText field={item.author} /></div>
    </div>
  {/each}
</div>
