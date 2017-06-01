var RE = new RegExp(
  '^' +
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz' +
  '{50}' +
  '$',
  'g'
)

module.exports = function (string) {
  return RE.test(string)
}
