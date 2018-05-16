const html = require('choo/html')
const Component = require('choo/component')
const { i18n } = require('../base')
const icon = require('../icon')

const LINK_THEMES = {
  'white': 'u-colorBrightBlue',
  'sand': 'u-colorWhite'
}

const ICON_THEMES = {
  'white': 'u-themeWhite',
  'sand': 'u-themeBlack'
}

const text = i18n(require('./lang.json'))

module.exports = class Footer extends Component {
  update (theme) {
    return this.theme !== theme
  }

  createElement (theme) {
    this.theme = theme
    return html`
      <footer class="u-textCenter u-spaceT8">
        <h2 class="u-spaceT8">
          <span class="u-textSizeLg u-textBold u-block u-spaceT8 u-spaceB2">
            ${text`Connect with us,`}
          </span>
          <span class="Display Display--footer">
            ${text`Be a force for good`}<br>
          </span>
        </h2>

        <div class="Display Display--footer u-spaceB8">
          <a class="Display-link ${LINK_THEMES[theme]} u-spaceB8" href="mailto:hello@thenewdivision.world">hello@thenewdivision.world</a>
        </div>

        <div class="Text u-spaceV8 u-inlineBlock ${ICON_THEMES[theme]}">
          <a href="#" class="u-inlineBlock u-spaceLch u-spaceRch">${icon.facebook()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.twitter()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.instagram()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.linkedin()}</a>
          <p class="u-textSizeXs u-spaceB8 u-spaceT6">
            ${text`© 2017 The New Division by Trollbäck + Company.`}<br>
            ${text`All Rights Reserved.`}
          </p>
        </div>
      </footer>
    `
  }
}
