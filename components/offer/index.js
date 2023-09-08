const html = require('choo/html')
const Component = require('choo/component')

class OfferQuestions extends Component {
  update () {
    return false
  }

  load (element) {
    const links = element.querySelectorAll('.js-link')
    if (!links.length) return

    links.forEach(link => {
      link.addEventListener('click', function (event) {
        const target = document.querySelector(link.getAttribute('href'))
        if (!target) return
        const details = target.closest('details')
        if (details) details.open = true

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
        event.preventDefault()
      })
    })
  }

  createElement (data) {
    return html`
      <div class="Offer Offer--questions">
        <div class="Words Words--columns">
          <div class="Words-header">
            ${data.heading}
          </div>
          <div class="Words-main">
            ${data.questions.map(function (question) {
              return html`
                <section>
                  <a href="#${question.target}" class="Offer-question js-link">
                    ${question.content}
                  </a>
                </section>
              `
            })}
          </div>
        </div>
      </div>
    `
  }
}

function offerAnswers (data) {
  return html`
    <details class="Offer Offer--answers" id="${data.target}">
      <summary>
        <div class="Words Words--large">
          <div class="Words-header">
            ${data.heading}
            ${data.introduction}
          </div>
        </div>
      </summary>
      ${data.answers.map(function (answer) {
        return html`
          <div id="${answer.target}" class="Offer-section">
            <section class="Words">
              ${answer.content}
            </section>
          </div>
        `
      })}
    </details>
  `
}

module.exports = { offerAnswers, OfferQuestions }
