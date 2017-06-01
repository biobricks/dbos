var bs58check = require('bs58check')
var concat = require('concat-stream')
var http = require('http')
var server = require('./server')
var tape = require('tape')

tape('GET /key', function (test) {
  server(function (port, done) {
    var request = {path: '/key', port: port}
    http.get(request, function (response) {
      test.equal(
        response.statusCode, 200,
        'responds 200'
      )
      test.equal(
        response.headers['content-type'], 'text/plain',
        'Content-Type: text/plain'
      )
      response.pipe(concat(function (body) {
        test.equal(
          bs58check.decode(body.toString()).byteLength, 32,
          'serves 32-byte base58check public key'
        )
        done()
        test.end()
      }))
    })
  })
})

tape('NOT-GET /key', function (test) {
  server(function (port, done) {
    var request = {method: 'POST', path: '/key', port: port}
    http.get(request, function (response) {
      test.equal(
        response.statusCode, 405,
        'responds 405'
      )
      done()
      test.end()
    })
  })
})
