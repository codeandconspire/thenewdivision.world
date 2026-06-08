<script>
  import { page } from '$app/state'
  import { createTranslate } from '$lib/i18n.js'

  const text = $derived(createTranslate(page.data?.language || 'en'))
</script>

<svelte:head>
  <title>{text`Nothing here`} – The New Division</title>
</svelte:head>

<div class="u-container">
  <div class="Intro Intro--large">
    <div class="Intro-content">
      <h1>{page.status === 404 ? text`Nothing here` : page.error?.message}</h1>
    </div>
  </div>
</div>
