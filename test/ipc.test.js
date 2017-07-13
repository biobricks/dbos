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

var concat = require('concat-stream')
var http = require('http')
var server = require('./server')
var tape = require('tape')

tape('GET /ipc?search={query}', function (test) {
  server(function (port, done) {
    http.get({
      port: port,
      path: '/ipc?search=' + encodeURIComponent('ball-point pens'),
      headers: {
        accept: 'text/plain'
      }
    }, function (response) {
      test.equal(
        response.statusCode, 200,
        'responds 200'
      )
      test.equal(
        response.headers['content-type'], 'text/plain',
        'Content-Type', 'text/plain'
      )
      response.pipe(concat(function (body) {
        test.assert(
          body
            .toString()
            .split('\n')
            .some(function (line) {
              return line.split('\t')[0] === 'B43K 7/00'
            }),
          'serves B43K 7/00'
        )
        test.end()
        done()
      }))
    })
  })
})
