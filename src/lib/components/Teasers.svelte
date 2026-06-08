<script>
  import A from './A.svelte'
  import Figure from './Figure.svelte'
  // Ported from components/teasers/index.js
  let { items = [] } = $props()
</script>

<div class="Teasers">
  <ul class="Teasers-list">
    {#each items as item}
      <li class="Teasers-item">
        <div class="Teasers-figure"><Figure image={item.image} teaser /></div>
        <div class="Teasers-body">
          {#if item.label}<span class="Teasers-label">{item.label}</span>{/if}
          {#if item.title}
            <h4 class="Teasers-title"><A link={item.link} class="Teasers-link">{item.title}</A></h4>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>
