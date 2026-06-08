import { ALTERNATE_LANGUAGES } from '$lib/i18n.js'

// Only the alternate languages (currently `sv`) appear as a URL prefix; English
// is served without a prefix.
const MATCH = new RegExp(`^(${ALTERNATE_LANGUAGES.join('|')})$`)

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match (param) {
  return MATCH.test(param)
}
