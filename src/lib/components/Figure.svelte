<script>
  import { src, srcset } from '$lib/image.js'
  import { className } from '$lib/utils.js'

  // Ported from components/figure/index.js
  let { image, half = false, team = false, teaser = false, fill = false, eager = false, class: cls = '', children = null } = $props()

  const desktop = $derived(image?.url ? image : null)
  const mobile = $derived(image?.url && image?.mobile?.url ? image.mobile : null)

  const config = $derived.by(() => {
    let sizes = [351, 387, 702, 774, [1053, 'q_70'], [1161, 'q_60'], [1223, 'q_60'], [1375, 'q_60'], [2446, 'q_60'], [2750, 'q_50']]
    let viewport = '93.6vw, (min-width: 700px) 95.555vw'
    if (half) {
      sizes = [170, 186, 340, 372, 510, 558, 630, 945, [1200, 'q_60'], [1800, 'q_60']]
      viewport = '45.2vw, (min-width: 700px) 46.666vw'
    }
    if (team) {
      sizes = [170, 186, 340, 372, 510, 558, 630, 766, [1200, 'q_60'], [1800, 'q_60']]
      viewport = '45.2vw, (min-width: 700px) 30.370vw'
    }
    if (teaser) {
      sizes = [80, 88, 160, 176, 200, 240, 264, 300, 400, 450, 600, [1000, 'q_70']]
      viewport = '21.2vw, (min-width: 700px) 13.9vw'
    }
    return { sizes, viewport }
  })

  const sources = $derived(desktop ? srcset(desktop.url, config.sizes) : '')
  const fallbackSrc = $derived(sources ? sources.split(' ')[0] : '')
  const loading = $derived(eager ? 'eager' : 'lazy')

  const classes = $derived(
    className('Figure', {
      'Figure--mobile': Boolean(desktop && mobile),
      'Figure--fill': fill,
      'Figure--children': Boolean(children)
    }) + (cls ? ` ${cls}` : '')
  )

  const aspectStyle = $derived.by(() => {
    if (!desktop) return ''
    let style = `--Figure-aspect: ${((desktop.dimensions.height / desktop.dimensions.width) * 100).toFixed(2)}%;`
    if (mobile) {
      style += ` --Figure-aspect-mobile: ${((mobile.dimensions.height / mobile.dimensions.width) * 100).toFixed(2)}%`
    }
    return style
  })
</script>

<figure class={classes}>
  {#if desktop}
    <div class="Figure-container" style={aspectStyle}>
      {#if mobile}
        <picture>
          <source srcset={sources} media="(min-width: 700px)" sizes={config.viewport} />
          <img
            class="Figure-image"
            alt=""
            srcset={srcset(mobile.url, config.sizes)}
            sizes={config.viewport}
            width={desktop.dimensions.width}
            height={desktop.dimensions.height}
            src={fallbackSrc}
            {loading}
          />
        </picture>
      {:else}
        <img
          class="Figure-image"
          alt=""
          srcset={sources}
          sizes={config.viewport}
          src={fallbackSrc}
          width={desktop.dimensions.width}
          height={desktop.dimensions.height}
          {loading}
        />
      {/if}
      {#if children}
        <div class="Figure-children">{@render children()}</div>
      {/if}
    </div>
  {/if}
</figure>
