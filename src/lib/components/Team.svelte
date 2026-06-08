<script>
  import RichText from './RichText.svelte'
  import Figure from './Figure.svelte'
  // Ported from components/team/index.js
  let { items = [] } = $props()
</script>

<div class="Team {items.length === 4 ? 'Team--alt' : ''}">
  {#each items as item}
    <div class="Team-item">
      <Figure image={item.image} team />
      <h3 class="Team-title">{item.title}</h3>
      {#if item.position}<p>{item.position}</p>{/if}
      {#if item.intro}<div class="Team-body"><RichText field={item.intro} /></div>{/if}
    </div>
  {/each}
</div>
