<script>
  import RichText from './RichText.svelte'
  // Ported from OfferQuestions (components/offer/index.js)
  let { heading = null, questions = [] } = $props()

  function onclick (event, target) {
    const el = document.getElementById(target)
    if (!el) return
    const details = el.closest('details')
    if (details) details.open = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    event.preventDefault()
  }
</script>

<div class="Offer Offer--questions">
  <div class="Words Words--columns">
    <div class="Words-header">
      <RichText field={heading} />
    </div>
    <div class="Words-main">
      {#each questions as question}
        <section>
          <a href="#{question.target}" class="Offer-question js-link" onclick={(e) => onclick(e, question.target)}>
            <RichText field={question.content} />
          </a>
        </section>
      {/each}
    </div>
  </div>
</div>
