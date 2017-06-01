var tape = require('tape')
var AJV = require('ajv')

tape('schemas', function (suite) {
  suite.test('publication', function (test) {
    var validate = new AJV({
      allErrors: true,
      verbose: true
    })
      .compile(require('../schemas/publication.json'))
    validate({
      name: 'Kyle Evan Mitchell',
      affiliation: 'BioBricks Foundation',
      journals: ['Nature'],
      classifications: ['G06F 3/00'],
      publications: [
        'M1kQepcCpyddcPZhNDMzXar6BMjBgEM9qgZ59NdvgFGnbNTsE'
      ],
      title: 'Distributed Digital Prior Art Publication',
      description: 'Blah blah blah blah blah...',
      attachments: [
        '2ELmDirZNkmTjp8NmECA9YtjqzpJiQtA3ex2ACe1CDJxfPsRXg'
      ],
      declaration: '0.0.0',
      license: '0.0.0'
    })
    test.equal(validate.errors, null)
    test.end()
  })

  suite.test('timestamp', function (test) {
    var validate = new AJV({
      allErrors: true,
      verbose: true
    })
      .compile(require('../schemas/timestamp.json'))
    validate({
      digest: 'M1kQepcCpyddcPZhNDMzXar6BMjBgEM9qgZ59NdvgFGnbNTsE',
      uri: (
        'https://bbf.kemitchell.com/publications/' +
        'M1kQepcCpyddcPZhNDMzXar6BMjBgEM9qgZ59NdvgFGnbNTsE'
      ),
      timestamp: '2017-06-01T18:36:31.584Z'
    })
    test.equal(validate.errors, null)
    test.end()
  })
})
