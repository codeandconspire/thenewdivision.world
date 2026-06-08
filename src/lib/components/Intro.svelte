<script>
  import RichText from './RichText.svelte'
  import A from './A.svelte'
  // Ported from components/intro/index.js
  let {
    title = null,
    sup = null,
    intro = null,
    large = false,
    pushed = false,
    action = null,
    label = null,
    tags = null,
    type = null,
    logo = null
  } = $props()
</script>

<div class="Intro {large ? 'Intro--large' : ''} {pushed ? 'Intro--pushed' : ''}">
  <div class="Intro-content">
    {#if sup}<span class="Intro-sup"><RichText field={sup} /></span>{/if}
    {#if title}<RichText field={title} />{/if}
    {#if intro}
      <div class="Intro-wrap">
        <div class="Intro-body">
          <div class="Words Words--large">
            <RichText field={intro} />
            {#if action}<A link={action.link} class="Intro-link">{action.text}</A>{/if}
          </div>
        </div>
        {#if logo || tags}
          <div class="Intro-details">
            {#if logo}
              <div class="Intro-detail">
                {#if label}<span class="Intro-label">{label}</span><br />{/if}
                {@render logo()}
              </div>
            {/if}
            {#if tags}
              <div class="Intro-detail">
                {#if type}<span class="Intro-label">{type}</span><br />{/if}
                <span class="Intro-tags">{tags}</span>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
