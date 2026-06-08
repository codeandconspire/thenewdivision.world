<script>
  import { PrismicRichText } from '@prismicio/svelte'
  import { filterEmpty } from '$lib/prismic.js'
  import Hyperlink from './Hyperlink.svelte'

  let { field } = $props()
  const components = { hyperlink: Hyperlink }
</script>

{#if field && field.length}
  <PrismicRichText field={filterEmpty(field)} {components} />
{/if}
