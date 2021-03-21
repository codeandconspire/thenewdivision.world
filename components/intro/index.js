const html = require('choo/html')

module.exports = intro

function intro (props = {}) {
  return html`
    <div class="Intro ${props.large ? 'Intro--large' : ''} ${props.pushed ? 'Intro--pushed' : ''}">
      <div class="Intro-content">
        ${props.sup ? html`<span class="Intro-sup">${props.sup}</span>` : null}
        ${props.title}
        ${props.intro || props.intro ? html`
          <div class="Intro-wrap">
            ${props.intro ? html`
              <div class="Intro-body">
                <div class="Words Words--large">
                  ${props.intro}
                </div>
              </div>
            ` : null}
            ${props.intro ? html`
              <div class="Intro-details">
                ${props.client ? html`
                  <div class="Intro-detail">
                    ${props.label ? html`<span class="Intro-label">${props.label}</span><br>` : null}
                    ${props.client}
                  </div>
                ` : null}
                ${props.tags ? html`
                  <div class="Intro-detail">
                    ${props.type ? html`<span class="Intro-label">${props.type}</span><br>` : null}
                    ${props.tags ? html`<span class="Intro-tags">${props.tags}</span>` : null}
                  </div>
                ` : null}
              </div>
            ` : null}
          </div>
        ` : null}
      </div>
    </div>
  `
}
