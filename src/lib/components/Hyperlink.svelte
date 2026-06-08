<!-- Rich-text hyperlink override so links resolve with the site's custom
     lang-prefixed resolver instead of relying on pre-resolved field.url. -->
<script>
  import { linkAttrs } from '$lib/prismic.js'
  export let node
  $: attrs = linkAttrs(node?.data || {})
</script>

<a {...attrs}><slot /></a>
