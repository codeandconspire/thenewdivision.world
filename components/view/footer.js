const html = require('choo/html')
const Component = require('choo/component')
const { i18n } = require('../base')
const icon = require('../icon')

const LINK_THEMES = {
  'white': 'u-colorPetrol',
  'brown': 'u-colorWhite'
}

const ICON_THEMES = {
  'white': 'u-themeWhite',
  'brown': 'u-themeBlack'
}

const text = i18n(require('./lang.json'))

module.exports = class Footer extends Component {
  update (theme) {
    return this.theme !== theme
  }

  createElement (theme) {
    this.theme = theme
    return html`
      <footer class="u-textCenter">
        <h2 class="u-spaceTlg">
          <span class="u-textSizeMd u-textBold u-block u-spaceBxs">
            ${text`Connect with us,`}
          </span>
          <span class="Display Display--xl">
            ${text`Become a force for good`}<br>
          </span>
        </h2>

        <div>
          <a class="Display Display--xl ${LINK_THEMES[theme]}" href="mailto:hello@thenewdivision.world">hello@thenewdivision.world</a>
        </div>

        <div class="Text u-spaceTlg u-spaceBmd u-inlineBlock ${ICON_THEMES[theme]}">
          <a href="#" class="u-inlineBlock u-spaceLch u-spaceRch">${icon.facebook()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.twitter()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.instagram()}</a>
          <a href="#" class="u-inlineBlock u-spaceRch">${icon.linkedin()}</a>
          <p>
            ${text`© 2017 The New Division by Trollbäck + Company.`}<br>
            ${text`All Rights Reserved.`}
          </p>
        </div>
      </footer>
    `
  }
}
