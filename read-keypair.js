var bs58check = require('bs58check')
var ecb = require('ecb')
var fs = require('fs')
var parse = require('json-parse-errback')
var path = require('path')

module.exports = function (directory, callback) {
  var file = path.join(directory, 'keys')
  fs.readFile(file, ecb(callback, function (data) {
    parse(data, ecb(callback, function (data) {
      callback(null, {
        public: bs58check.decode(data.public),
        secret: bs58check.decode(data.secret)
      })
    }))
  }))
}
