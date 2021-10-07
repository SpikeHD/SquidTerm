const menu = require('./game/mainMenu');
const { CLEAR } = require('./util/stdHelpers');

;(async () => {
  // Menu
  await menu();
})();

process.on('exit', () => {
  // Clear console on exit
  process.stdout.write(CLEAR);
});
