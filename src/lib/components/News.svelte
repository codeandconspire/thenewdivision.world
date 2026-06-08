<script>
  import RichText from './RichText.svelte'
  // Ported from components/news/index.js
  let { items = [] } = $props()
</script>

<div class="News">
  {#each items as item}
    <div class="News-item">
      {#if item.date}<span class="News-date">{item.date}</span>{/if}
      <div class="News-title"><RichText field={item.title} /></div>
    </div>
  {/each}
</div>
