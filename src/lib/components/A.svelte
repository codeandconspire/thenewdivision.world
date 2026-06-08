<!-- General anchor that resolves a Prismic link field or string href. -->
<script>
  import { linkAttrs } from '$lib/prismic.js'

  let { link, class: cls = undefined, onclick = undefined, children, ...rest } = $props()
  const attrs = $derived(linkAttrs(link, cls ? { class: cls } : {}))
</script>

<a {...attrs} {onclick} {...rest}>{@render children?.()}</a>
