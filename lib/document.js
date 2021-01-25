const dedent = require('dedent')
const hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    head: {
      _prependHtml: dedent`
        <style>
          html {
            font-family: -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }
          body {
            margin: 0 auto;
            padding: 5rem 2rem;
            max-width: 40rem;
          }
          img, video, svg {
            max-width: 100%;
            height: auto;
          }
          [role="presentation"],
          [aria-hidden="true"] {
            display: none;
          }
        </style>
      `
    }
  })
}
