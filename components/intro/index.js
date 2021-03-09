const html = require('choo/html')

module.exports = intro

// title: asElement(data.heading, resolve, serialize),
// intro: data.intro && data.intro.length ? asElement(data.intro, resolve, serialize) : null,
// client: data.client && data.client.id ? Clients.logos(state)(data.client) : null,
// label: data.label ? data.label : null,
// tags: data.tags ? data.tags : null,
// type: data.type ? data.type : null

function intro (props = {}) {
  return html`
    <div class="Intro">
      <div class="Intro-content">
        ${props.title}
        ${props.intro ? html`
          <div class="Intro-body">
            <div class="Words">
              ${props.intro}
            </div>
          </div>
        ` : null}
      </div>
    </div>
  `
}
