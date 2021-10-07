const menu = require('./game/mainMenu');
const redLight = require('./game/redLight')
const { CLEAR } = require('./util/stdHelpers');

;(async () => {
  // Menu
  await menu();

  await redLight.play();
})();

process.on('exit', () => {
  // Clear console on exit
  process.stdout.write(CLEAR);
});
