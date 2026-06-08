<script>
  import RichText from './RichText.svelte'
  // Ported from offerAnswers (components/offer/index.js)
  let { heading = null, introduction = null, target = null, answers = [] } = $props()
</script>

<details class="Offer Offer--answers" id={target}>
  <summary>
    <div class="Words Words--large">
      <div class="Words-header">
        <RichText field={heading} />
        <RichText field={introduction} />
      </div>
    </div>
  </summary>
  {#each answers as answer}
    <div id={answer.target} class="Offer-section">
      <section class="Words">
        <RichText field={answer.content} />
      </section>
    </div>
  {/each}
</details>
