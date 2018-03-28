const view = require('../components/view')

module.exports = view(catchall)

function catchall () {
  const err = new Error('Page does not exist')
  err.status = 404
  throw err
}
