<script>
  import { resolve, validateLink, asText } from '$lib/prismic.js'
  import { className } from '$lib/utils.js'

  import Intro from './Intro.svelte'
  import Words from './Words.svelte'
  import Callout from './Callout.svelte'
  import Cases from './Cases.svelte'
  import Quotes from './Quotes.svelte'
  import Reel from './Reel.svelte'
  import News from './News.svelte'
  import Team from './Team.svelte'
  import Thoughts from './Thoughts.svelte'
  import Teasers from './Teasers.svelte'
  import Enterence from './Enterence.svelte'
  import Media from './Media.svelte'
  import Figure from './Figure.svelte'
  import Illustration from './Illustration.svelte'
  import ClientsList from './ClientsList.svelte'
  import Logo from './Logo.svelte'
  import OfferQuestions from './OfferQuestions.svelte'
  import OfferAnswers from './OfferAnswers.svelte'

  // Ported from components/slices/index.js (Slices.asSlice dispatcher).
  let { slices = [], light = false, clients = null, language = 'en', uid = null, text } = $props()

  function itemClass (slice) {
    const data = slice.primary || {}
    return className('Slices-item', {
      'Slices-item--half': data.half || slice.slice_type === 'callout',
      'Slices-item--space': data.space || slice.slice_type === 'space',
      'u-hiddenVisually': data.hidden
    })
  }

  const has = (field) => Array.isArray(field) && field.length > 0
</script>

<div class="Slices js-slices">
  {#each slices || [] as slice, index}
    {@const data = slice.primary || {}}
    {@const items = slice.items || []}
    {@const type = slice.slice_type}

    {#if type === 'space'}
      <div class={itemClass(slice)} id="space-{index}"></div>

    {:else if type === 'intro'}
      {#if has(data.heading)}
        {@const link = validateLink(data.link)}
        <div class={itemClass(slice)} id="intro-{index}">
          <Intro
            title={data.heading}
            intro={has(data.intro) ? data.intro : null}
            large
            action={link ? { link, text: data.link_text ? data.link_text : text`Read more` } : null}
          />
        </div>
      {/if}

    {:else if type === 'intro_case'}
      {#if has(data.heading)}
        <div class={itemClass(slice)} id="intro_case-{index}">
          <Intro
            title={data.heading}
            large
            intro={has(data.intro) ? data.intro : null}
            label={data.label || null}
            tags={data.tags || null}
            type={data.type || null}
          >
            {#snippet logo()}
              {#if data.client && data.client.id}
                <Logo id={data.client.id} {clients} dark={light} large />
              {/if}
            {/snippet}
          </Intro>
        </div>
      {/if}

    {:else if type === 'heading'}
      {#if has(data.heading)}
        <div class={itemClass(slice)} id="heading-{index}">
          <Intro
            sup={has(data.label) ? data.label : null}
            large={data.large}
            title={data.heading}
            pushed={data.pushed}
          />
        </div>
      {/if}

    {:else if type === 'body'}
      {#if has(data.text) || has(data.heading)}
        <div class={itemClass(slice)} id="body-{index}">
          <Words
            columns={data.columns}
            pushed={data.pushed}
            header={has(data.heading) && data.heading[0].text ? data.heading : null}
            main={data.text}
          />
        </div>
      {/if}

    {:else if type === 'photo'}
      {#if data.image && data.image.url}
        <div class={itemClass(slice)} id="photo-{index}">
          <Media caption={has(data.caption) ? data.caption : null}>
            {#snippet figure()}
              <Figure image={data.image} half={data.half} eager={index < 3} />
            {/snippet}
          </Media>
        </div>
      {/if}

    {:else if type === 'video'}
      {#if data.vimeo}
        <div class={itemClass(slice)} id="video-{index}">
          <Media caption={has(data.caption) ? data.caption : null}>
            {#snippet figure()}
              {@html data.vimeo}
            {/snippet}
          </Media>
        </div>
      {/if}

    {:else if type === 'callout'}
      {#if data.heading || data.content}
        {@const link = validateLink(data.link)}
        <div class={itemClass(slice)} id="callout-{index}">
          <Callout
            heading={data.heading ? asText(data.heading) : null}
            content={data.content ? data.content : null}
            link={link ? resolve(link) : null}
            icon={data.icon}
            loose={data.loose}
          />
        </div>
      {/if}

    {:else if type === 'logos'}
      <div class={itemClass(slice)} id="logos-{index}">
        <ClientsList {clients} dark={light} />
      </div>

    {:else if type === 'news'}
      {@const articles = items.filter((item) => has(item.heading)).map((item) => ({ date: item.date || null, title: item.heading }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="news-{index}">
          <News items={articles} />
        </div>
      {/if}

    {:else if type === 'thoughts'}
      {@const articles = items.filter((item) => has(item.heading)).map((item) => ({ title: item.heading }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="thoughts-{index}">
          <Thoughts items={articles} title={data.heading ? asText(data.heading) : null} />
        </div>
      {/if}

    {:else if type === 'team'}
      {@const articles = items
        .filter((item) => has(item.heading) && item.image && item.image.url)
        .map((item) => ({
          image: item.image,
          title: asText(item.heading),
          position: has(item.position) ? asText(item.position) : null,
          intro: has(item.intro) ? item.intro : null
        }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="team-{index}">
          <Team items={articles} />
        </div>
      {/if}

    {:else if type === 'cases'}
      {@const articles = items
        .filter((item) => has(item.heading) && validateLink(item.link))
        .map((item) => ({ title: item.heading, clientId: item.client && item.client.id ? item.client.id : null, link: item.link }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="cases-{index}">
          <Cases items={articles} title={has(data.heading) ? asText(data.heading) : null} pushed={data.pushed} {clients} dark={light} />
        </div>
      {/if}

    {:else if type === 'quotes'}
      {@const articles = items
        .filter((item) => has(item.content))
        .map((item) => ({ content: item.content, author: has(item.author) ? item.author : null, clientId: item.client && item.client.id ? item.client.id : null }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="quotes-{index}">
          <Quotes items={articles} {clients} dark={light} />
        </div>
      {/if}

    {:else if type === 'offer_questions'}
      {@const questions = items.filter((item) => has(item.question)).map((item) => ({ content: item.question, target: item.target || null }))}
      {#if questions.length}
        <div class={itemClass(slice)} id="offer_questions-{index}">
          <OfferQuestions heading={has(data.heading) ? data.heading : null} {questions} />
        </div>
      {/if}

    {:else if type === 'offer_answers'}
      {@const answers = items.filter((item) => has(item.answer)).map((item) => ({ content: item.answer, target: item.target || null }))}
      {#if answers.length}
        <div class={itemClass(slice)} id="offer_answers-{index}">
          <OfferAnswers
            heading={has(data.heading) ? data.heading : null}
            target={data.target}
            introduction={has(data.introduction) ? data.introduction : null}
            {answers}
          />
        </div>
      {/if}

    {:else if type === 'banner'}
      {#if has(data.heading) && data.image && data.image.url}
        {@const link = validateLink(data.link)}
        {#if link}
          <div class={itemClass(slice)} id="banner-{index}">
            <Media
              label={has(data.label) ? data.label : null}
              title={data.heading ? asText(data.heading) : null}
              {link}
              dark={data.dark}
            >
              {#snippet figure()}
                <Figure image={data.image} half={data.half} />
              {/snippet}
            </Media>
          </div>
        {/if}
      {/if}

    {:else if type === 'enterence'}
      {#if has(data.heading) && data.image && data.image.url}
        {@const link = validateLink(data.link)}
        {#if link}
          <div class={itemClass(slice)} id="enterence-{index}">
            <Enterence
              label={data.label || null}
              title={data.heading ? asText(data.heading) : null}
              clientId={data.client && data.client.id ? data.client.id : null}
              {link}
              small={data.half}
              color={data.dark_label ? 'light' : 'dark'}
              image={data.image}
              {clients}
              {light}
            />
          </div>
        {/if}
      {/if}

    {:else if type === 'teasers'}
      {@const articles = items
        .filter((item) => has(item.heading) && item.image && item.image.url && validateLink(item.link))
        .map((item) => ({ link: item.link, title: asText(item.heading), label: item.label || null, image: item.image }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="teasers-{index}">
          <Teasers items={articles} />
        </div>
      {/if}

    {:else if type === 'reel'}
      {@const articles = items
        .filter((item) => has(item.quote))
        .map((item) => ({
          quote: item.quote,
          author: has(item.author) ? asText(item.author) : null,
          desc: has(item.desc) ? asText(item.desc) : null,
          clientId: item.client && item.client.id ? item.client.id : null
        }))}
      {#if articles.length}
        <div class={itemClass(slice)} id="reel-{index}">
          <Reel items={articles} delay={data.delay || null} title={uid === 'cases' ? text`Cases` : null} {clients} />
        </div>
      {/if}

    {:else if type === 'illustration'}
      <div class={itemClass(slice)} id="illustration-{index}">
        <Illustration version={data.version} />
      </div>
    {/if}
  {/each}
</div>
