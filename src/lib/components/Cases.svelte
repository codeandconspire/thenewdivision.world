<script>
  import RichText from './RichText.svelte'
  import A from './A.svelte'
  import Logo from './Logo.svelte'
  // Ported from components/cases/index.js
  let { items = [], title = null, pushed = false, clients = null, dark = false } = $props()
</script>

<section class="Cases {pushed ? 'Cases--pushed' : ''}">
  {#if title}<h3 class="Cases-title">{title}</h3>{/if}
  {#each items as item}
    <div class="Cases-item">
      <div class="Cases-name">
        <A link={item.link} class="Cases-link"><RichText field={item.title} /></A>
      </div>
      {#if item.clientId}<Logo id={item.clientId} {clients} {dark} small />{/if}
    </div>
  {/each}
</section>
