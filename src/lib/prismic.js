import * as prismic from '@prismicio/client'

// Resolve a Prismic document or link field to an href.
// Ported verbatim from the original components/base.js#resolve.
export function resolve (doc) {
  if (!doc) return null
  switch (doc.type) {
    case 'page': {
      const prefix = doc.lang === 'en-us' ? '' : `/${doc.lang.substring(0, 2)}`
      return doc.uid === 'home' ? prefix || '/' : `${prefix}/${doc.uid}`
    }
    case 'setting':
    case 'settings':
      return doc.lang === 'en-us' ? '/' : `/${doc.lang.substring(0, 2)}`
    case 'Web':
    case 'Media':
      return doc.url
    case 'broken_type':
      return '/404'
    default: {
      const type = doc.link_type
      if (type === 'Web' || type === 'Media' || type === 'Any') return doc.url
      throw new Error(`Could not resolve href for document type "${doc.type}"`)
    }
  }
}

// Build anchor attributes for a link field or string (ported from base.js#a).
export function linkAttrs (link, attrs = {}) {
  attrs = Object.assign({}, attrs)
  if (typeof link === 'string') {
    attrs.href = link
    return attrs
  }
  try {
    attrs.href = resolve(link)
  } catch {
    attrs.href = link?.url || null
  }
  if (link?.target === '_blank') {
    attrs.target = '_blank'
    attrs.rel = 'noopener noreferrer'
  }
  if (link?.link_type === 'Media') attrs.download = true
  return attrs
}

// A link is valid when it resolves to something (matches slices validate()).
export function validateLink (link) {
  if (!link || link.link_type === 'Any' || link.isBroken) return null
  return link
}

// Nullable plain-text getter for a rich text field (ported from base.js#asText).
export function asText (field) {
  if (typeof field === 'string') return field
  if (!field || !field.length) return null
  return prismic.asText(field) || null
}

// Remove empty paragraph/heading nodes, reproducing base.js#serialize which
// rendered empty blocks as nothing.
const BLOCKS = ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6']
export function filterEmpty (field) {
  if (!Array.isArray(field)) return field
  return field.filter((node) => {
    if (BLOCKS.includes(node.type)) {
      return node.text !== '' && !/^\s+$/.test(node.text)
    }
    return true
  })
}

// Whether a rich text field has any renderable content.
export function hasContent (field) {
  return Array.isArray(field) && field.length > 0 && filterEmpty(field).length > 0
}
