const dedent = require('dedent')
const hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    head: {
      _appendHtml: dedent`
        <script>document.documentElement.classList.add('has-js')</script>
        <link rel="shortcut icon" href="/assets/favicon.ico">
        <link rel="mask-icon" href="/assets/icon.svg" color="#000">
        <link rel="dns-prefetch" href="https://thenewdivision.cdn.prismic.io">
        <link rel="dns-prefetch" href="https://ik.imagekit.io">
      `
    }
  })
}
