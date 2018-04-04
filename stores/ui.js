module.exports = ui

const THEMES = {
  white: 'u-themeWhite',
  brown: 'u-themeBrown'
}

function ui (state, emitter) {
  state.ui = {
    theme: 'white'
  }

  emitter.on('ui:theme', function (name) {
    state.ui.theme = name
    if (typeof window !== 'undefined') {
      const theme = THEMES[name] || ''

      let value = document.documentElement.classList.value
      if (/u-theme\w+/.test(value)) {
        value = value.replace(/u-theme\w+/, theme)
      } else {
        value += ` ${theme}`
      }

      document.documentElement.setAttribute('class', value.trim())
    }
  })

  // circumvent choo default scroll-to-anchor behavior
  emitter.on('navigate', function () {
    const el = document.getElementById(state.params.anchor)

    if (!el) return

    const from = window.scrollY
    window.setTimeout(function () {
      // reset scroll to where it was before navigate
      window.scrollTo(window.scrollX, from)
      window.setTimeout(function () {
        // smoothly scroll element into view when everything has settled
        el.scrollIntoView({behavior: 'smooth', block: 'start'})
      }, 0)
    }, 0)
  })
}
