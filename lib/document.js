const hyperstream = require('hyperstream')

module.exports = document

function document () {
  return hyperstream({
    head: {
      _appendHtml: `
        <script>document.documentElement.classList.add('has-js')</script>
        <link rel="shortcut icon" href="/assets/favicon.ico">
      `
    }
  })
}
