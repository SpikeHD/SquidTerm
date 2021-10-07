const chalk = require('chalk');
const keypress = require('../util/keypress');
const { CLEAR } = require('../util/stdHelpers');

let redLight = false;
let dead = false;
let active = true;

let secondsElapsed = 0;

// For space calculation
const columns = process.stdout.columns;
const rows = process.stdout.rows-2;

let gameState = {
  start: {
    x: 0,
    y: Math.round(rows/2)
  },
  // Offset end linefrom the end of the terminal window
  end: columns-10,
  player: {
    x: 0
  }
}

module.exports.play = async () => {

  draw();

  // begin changeLight background stuff
  changeLight();

  // So we don't double-draw when light changes
  let prevLight = redLight;

  const timer = setInterval(() => {
    if (prevLight == redLight) {
      secondsElapsed++;
      draw();
    }

    prevLight = redLight;
  }, 1000);

  while(active) {
    const key = await keypress();

    active = !dead;

    switch(key) {
      case 'escape':
        process.exit();

      case 'space':
        move();
    }

    draw();
  }

  clearInterval(timer);

  if (dead) {
    console.log('Good try! You made it a distance of ' + gameState.player.x + ' out of ' + gameState.end)
  } else {
    console.log('You did it! You crossed a distance of ' + gameState.player.x);
  }
}

function move() {
  gameState.player.x++;

  // Uh oh, we moved during red light!
  if (redLight) dead = true;
  if (gameState.player.x >= gameState.end) active = false;
}

function draw() {
  let output = '';

  process.stdout.write(CLEAR)

  for (let y = 0; y < rows; y++) {
    let thisRow = ''

    for (let x = 0; x < columns; x++) {
      if (y == gameState.start.y && x == gameState.player.x) {
        if (dead) output += chalk.red('X')
        else output += "▓";
      } else if (x == gameState.end) {
        output += '|'
      } else output += ' '
    }

    output += thisRow + '\n'
  }

  if (redLight) output += chalk.bgRed(' Red Light! ' + secondsElapsed + 's ')
  else output += chalk.bgGreen(chalk.black(' Green Light! ' + secondsElapsed + 's '))

  console.log(output)
}

async function changeLight() {
  if (!active) return;

  setTimeout(() => {
    if (!active) return;

    redLight = !redLight;
    secondsElapsed = 0;
    draw();
    changeLight();
  }, Math.floor(Math.random() * (6 - 2 + 1) + 2) * 1000)
}

// TODO count up using letters to anticipate light change