const lang = require('../lib/i18n.json')

module.exports = i18n

function i18n (state, emitter, app) {
  const match = state.route.match(/^(\w{2})(?:\/|$)/)
  state.language = match ? match[1] : 'en'

  emitter.on('languagechange', function (language) {
    document.documentElement.lang = language
    state.language = language
    emitter.emit('render')
  })

  // Get text by applying as tagged template literal i.e. text`Hello ${str}`
  state.text = function text (strings, ...parts) {
    parts = parts || []

    const key = Array.isArray(strings) ? strings.join('%s') : strings
    const value = lang[state.language][key] || key

    let hasForeignPart = false
    const res = value.split('%s').reduce(function (result, str, index) {
      const part = parts[index] || ''
      if (!hasForeignPart) {
        hasForeignPart = typeof part !== 'string' && typeof part !== 'number'
      }
      result.push(str, part)
      return result
    }, [])

    return hasForeignPart ? res : res.join('')
  }
}
