module.exports = {
  /* eslint-disable */
  POSITION: (x, y) => `${'\033'}[${y};${x}f`,
  CLEAR: '\033c'
}