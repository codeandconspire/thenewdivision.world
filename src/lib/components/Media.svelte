<script>
  import RichText from './RichText.svelte'
  import A from './A.svelte'
  // Ported from components/media/index.js
  let { title = null, label = null, link = null, caption = null, dark = false, figure } = $props()
</script>

<div class="Media {dark ? 'Media--dark' : ''}">
  <div class="Media-container">
    <div class="Media-figure">{@render figure?.()}</div>
    {#if title}
      <div class="Media-content">
        {#if label}<div class="Media-label"><RichText field={label} /></div>{/if}
        <h3 class="Media-title">
          <A {link} class="Media-link">{title}</A>
        </h3>
      </div>
    {/if}
  </div>

  {#if caption}<span class="Media-caption"><RichText field={caption} /></span>{/if}
</div>
