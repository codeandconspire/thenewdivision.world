// Compose a class name from a root and a map of conditional classes.
// Ported from base.js#className.
export function className (root, classes) {
  if (typeof root === 'object' && root !== null) {
    classes = root
    root = []
  } else if (typeof root === 'string') {
    root = [root]
  } else {
    root = root ? root.slice() : []
  }

  return Object.keys(classes || {})
    .reduce((list, key) => {
      if (!classes[key] || !key) return list
      list.push(key)
      return list
    }, root)
    .join(' ')
}

// Detect a modifier key on a click/keyboard event (ported from base.js#metaKey).
export function metaKey (e) {
  if (e.button && e.button !== 0) return true
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
}

// Current viewport height (ported from base.js#vh).
export function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

// Placeholder loading text of a given length (ported from base.js#loader).
export function loader (length, alt = false) {
  const content = '⏳'
    .repeat(length)
    .split('')
    .reduce(function (str, char, i) {
      if (i % 3 !== 0) char += ' '
      return str + char
    }, '')
  return { class: `u-loading${alt ? 'Alt' : ''}`, content }
}
