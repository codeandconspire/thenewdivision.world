<script>
  import RichText from './RichText.svelte'
  import Icon from './Icon.svelte'
  // Ported from components/callout/index.js
  let { heading = null, content = null, link = null, icon = null, loose = false } = $props()
</script>

<section class="Callout {loose ? 'Callout--loose' : ''}">
  <hr aria-hidden="true" class="u-hiddenVisually" />
  {#if icon}<Icon name={icon} class="Callout-icon" mono />{/if}
  <div>
    {#if heading}
      <h2 class="Callout-title">
        {#if link}<a class="Callout-link" href={link}>{heading}</a>{:else}{heading}{/if}
      </h2>
    {/if}
    {#if content}<div class="Callout-body"><RichText field={content} /></div>{/if}
  </div>
</section>
