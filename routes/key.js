var bs58check = require('bs58check')
var methodNotAllowed = require('./method-not-allowed')
var readKeypair = require('../read-keypair')

module.exports = function (request, response, configuration) {
  if (request.method === 'GET') {
    readKeypair(configuration.directory, function (error, keypair) {
      /* istanbul ignore if */
      if (error) {
        request.log.error(error)
        response.statusCode = 500
        response.end()
      } else {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/plain')
        response.end(bs58check.encode(keypair.public))
      }
    })
  } else {
    methodNotAllowed(response)
  }
}
