/*
Copyright 2017 The BioBricks Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

var http = require('http')
var server = require('./server')
var tape = require('tape')

tape('GET /styles.css', function (test) {
  server(function (port, done) {
    var request = {path: '/styles.css', port: port}
    http.get(request, function (response) {
      test.equal(
        response.statusCode, 200,
        'responds 200'
      )
      test.equal(
        response.headers['content-type'], 'text/css; charset=UTF-8',
        'Content-Type: text/css; charset=UTF-8'
      )
      done()
      test.end()
    })
  })
})

tape('NOT-GET /styles.css', function (test) {
  server(function (port, done) {
    var request = {
      method: 'DELETE',
      path: '/styles.css',
      port: port
    }
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
