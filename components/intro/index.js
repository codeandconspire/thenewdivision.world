const html = require('choo/html')
const { loader, className } = require('../base')

module.exports = intro

function intro (props = {}) {
  const center = props.center && !props.icon
  const classes = className('Intro', {
    'Intro--center': center,
    'Intro--larger': props.larger,
    'Intro--wrapped': props.wrapped
  })

  return html`
    <div class="${classes}">
      <div class="Intro-layout">
        ${props.loading ? html`
          ${props.icon ? html`<div class="Intro-icon u-loading"></div>` : null}
          <div class="Intro-content">
            ${props.breadcrumbs ? html`<div class="Intro-breadcrumbs">${loader(8)}</div>` : null}
            ${props.label ? html`<span class="Intro-label">${loader(4)}</span>` : null}
            <h1 class="Intro-title">${loader(6)}</h1>
            ${props.body ? html`
              <div class="Intro-body">
                <div class="RichText RichText--adaptive ${center ? 'RichText--middle' : ''}">
                  <p>${loader(38)}</p>
                </div>
              </div>
            ` : null}
          </div>
        ` : html`
          ${props.icon && props.icon.url ? html`
            <div class="Intro-icon ${props.icon.overflow ? 'Intro-icon--overflow' : ''}">
              <img src="${props.icon.url}" width="1000" height="1000" alt="" role="presentation">
            </div>
          ` : null}
          <div class="Intro-content">
            ${props.breadcrumbs && props.breadcrumbs.length ? html`
              <nav class="Intro-breadcrumbs" id="breadcrumbs">
                ${props.breadcrumbs.map(function (item, index) {
                  if (index !== props.breadcrumbs.length - 1) {
                    return html`<br><a href="${item.link}">${item.text}</a>`
                  }
                  return html`<br><span>${item.text}</span>`
                })}
              </nav>
            ` : null}
            ${props.label ? html`<span class="Intro-label">${props.label}</span>` : null}
            <h1 class="Intro-title">${props.title}</h1>
            ${props.body ? html`
              <div class="Intro-body">
                <div class="RichText RichText--adaptive ${center ? 'RichText--middle' : ''}">
                  ${props.body}
                </div>
              </div>
            ` : null}
            ${props.children ? html`
              <div class="Intro-children">${props.children}</div>
            ` : null}
          </div>
        `}
      </div>
    </div>
  `
}
