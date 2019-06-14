var html = require('choo/html')
var Component = require('choo/component')
var {i18n} = require('../base')
var icon = require('../icon')

var ICON_THEMES = {
  'white': 'u-themeWhite',
  'sand': 'u-themeBlack'
}

var text = i18n(require('./lang.json'))

module.exports = class Footer extends Component {
  update (theme) {
    return this.theme !== theme
  }

  createElement (theme) {
    this.theme = theme
    return html`
      <footer class="u-textCenter u-spaceT8">
        <div class="u-spaceT2">
          <h2 class="u-spaceT8">
            <span class="u-textSizeLg u-textBold u-block u-spaceT8 u-spaceB4">
              ${text`Connect with us,`}
            </span>
            <span class="Display Display--footer">
              ${text`Be a force for good`}<br>
            </span>
          </h2>

          <div class="Display Display--footer u-spaceB8">
            <a class="Display-link u-spaceB8" href="mailto:hello@thenewdivision.world">hello@thenewdivision.world</a>
          </div>

          <div class="Text u-spaceV8 u-inlineBlock ${ICON_THEMES[theme]}">
            <a href="https://www.facebook.com/thenewdiv/" class="u-inlineBlock u-spaceL2 u-spaceR2">${icon.facebook()}</a>
            <a href="https://twitter.com/thenewdiv/" class="u-inlineBlock u-spaceR2">${icon.twitter()}</a>
            <a href="https://www.instagram.com/thenewdiv/" class="u-inlineBlock u-spaceR2">${icon.instagram()}</a>
            <a href="https://www.linkedin.com/company/the-new-division-by-trollb%C3%A4ck-company/" class="u-inlineBlock u-spaceR2">${icon.linkedin()}</a>
            <p class="u-textSizeXs u-spaceT4">
              ${text`© 2018 The New Division by Trollbäck + Company.`}<br>
              ${text`All Rights Reserved.`}
              <br>
              <br>
              <a href="https://github.com/codeandconspire/thenewdivision.world" target="_blank" rel="noopener noreferrer">${text`This website is open-source.`}</a>
            </p>
          </div>
        </div>
      </footer>
    `
  }
}
