var Negotiator = require('negotiator')
var ecb = require('ecb')
var fs = require('fs')
var methodNotAllowed = require('./method-not-allowed')
var mustache = require('mustache')
var parse = require('json-parse-errback')
var path = require('path')
var runParallel = require('run-parallel')
var send = require('send')
var straightenQuotes = require('straighten-quotes')
var wordwrap = require('wordwrap')

var documents = path.join(__dirname, '..', 'documents')

var TEMPLATE = path.join(
  __dirname, '..', 'templates', 'document.html'
)

module.exports = function (name) {
  return function (request, response) {
    if (request.method === 'GET') {
      var type = new Negotiator(request).mediaType([
        'application/json', 'text/plain', 'text/html'
      ])
      if (!type) {
        response.statusCode = 415
        response.end()
      } else {
        var json = path.join(documents, name + '.json')
        /* istanbul ignore else */
        if (type === 'application/json') {
          send(request, json)
            .on('error', /* istanbul ignore next */ function (error) {
              response.statusCode = error.status || 500
              response.end(error.message)
            })
            .pipe(response)
        } else if (type === 'text/plain') {
          console.error('got here')
          fs.readFile(json, 'utf8', function (error, json) {
            /* istanbul ignore if */
            if (error) {
              response.statusCode = 404
              response.end()
            } else {
              parse(json, function (error, data) {
                /* istanbul ignore if */
                if (error) {
                  response.statusCode = 500
                  response.end()
                } else {
                  response.setHeader(
                    'Content-Type', 'text/plain; charset=UTF-8'
                  )
                  response.end(jsonToTXT(data))
                }
              })
            }
          })
        } else if (type === 'text/html') {
          var template
          var doc
          runParallel([
            function (done) {
              fs.readFile(json, 'utf8', ecb(done, function (json) {
                parse(json, ecb(done, function (parsed) {
                  doc = parsed
                  done()
                }))
              }))
            },
            function (done) {
              fs.readFile(TEMPLATE, 'utf8', ecb(done, function (read) {
                template = read
                done()
              }))
            }
          ], function (error) {
            /* istanbul ignore if */
            if (error) {
              response.statusCode = 500
              response.end()
            } else {
              response.setHeader(
                'Content-Type', 'text/html; charset=UTF-8'
              )
              response.end(mustache.render(template, doc))
            }
          })
        }
      }
    } else {
      methodNotAllowed(response)
    }
  }
}

var COLUMNS = 60
var wrapParagraph = wordwrap(COLUMNS)
var wrapItem = wordwrap(4, COLUMNS)

function jsonToTXT (json) {
  return straightenQuotes(
    [
      wrapParagraph(json.title),
      wrapParagraph('Version ' + json.version),
      wrapParagraph(json.preamble)
    ]
      .concat(
        json.items.map(function (item, index) {
          return index + '.  ' + wrapItem(item).trim()
        }),
        wrapParagraph(json.copyright),
        wrapParagraph(json.license)
      )
      .join('\n\n')
  )
}
