import dictionary from './i18n.json'

export const LANGUAGES = Object.keys(dictionary)
export const ALTERNATE_LANGUAGES = LANGUAGES.filter((lang) => lang !== 'en')

/**
 * Create a `text` tagged-template helper for a language, mirroring the original
 * Choo `state.text` store. Usage: `t\`Read more\`` or `t('Read more')`.
 */
export function createTranslate (language = 'en') {
  const lang = dictionary[language] ? language : 'en'

  return function text (strings, ...parts) {
    parts = parts || []

    const key = Array.isArray(strings) ? strings.join('%s') : strings
    const value = dictionary[lang][key] || key

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
