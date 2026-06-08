<script>
  import RichText from './RichText.svelte'
  // Ported from components/words/index.js
  let { header = null, main = null, pushed = false, columns = false } = $props()
</script>

<section class="Words {pushed ? 'Words--pushed' : ''} {columns ? 'Words--columns' : ''}">
  {#if header}
    <div class="Words-header"><RichText field={header} /></div>
  {/if}
  <div class="Words-main"><RichText field={main} /></div>
</section>
