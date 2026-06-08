<script>
  import RichText from './RichText.svelte'
  // Ported from components/thoughts/index.js
  let { items = [], title = null } = $props()
</script>

<section class="Thoughts">
  {#if title}<h2 class="Thoughts-title">{title}</h2>{/if}
  {#each items as item}
    <div class="Thoughts-item"><RichText field={item.title} /></div>
  {/each}
</section>
