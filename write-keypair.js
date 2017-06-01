var bs58check = require('bs58check')
var fs = require('fs')
var path = require('path')
var sodium = require('sodium-prebuilt').api

module.exports = function (directory, callback) {
  var keypair = sodium.crypto_sign_keypair()
  var file = path.join(directory, 'keys')
  var json = JSON.stringify({
    public: bs58check.encode(keypair.publicKey),
    secret: bs58check.encode(keypair.secretKey)
  })
  fs.writeFile(file, json, callback)
}
