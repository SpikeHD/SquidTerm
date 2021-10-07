const draw = (t) => console.log(t);
const replace = (t) => process.stdout.write(t);
const chalk = require('chalk');
const keypress = require('../util/keypress');
const { POSITION, CLEAR } = require('../util/stdHelpers');

let active = true;
let selected = 0;
const buttonPos = {};

// For space calculation
const columns = process.stdout.columns;
const rows = process.stdout.rows-2;

module.exports.init = async (buttons, keyHandler) => {
  menuDraw(buttons);

  while(active) {
    const key = await keypress();

    selected = await keyHandler(key, selected);

    // If keyHandler returned false, it means we are done with the menu
    if (!selected) active = false;

    menuOptionSelect(buttons, selected);
  }
};

// One-time drawn function that will populate our menu positions
// allowing us to just overwrite them instead 
function menuDraw(buttons) {
  // Clear console
  process.stdout.write(CLEAR);

  const middle = Math.round(rows/2);
  const bLength = buttons.join('').length + (4 * buttons.length);

  for (let i = 0; i < rows; i++) {
    let row = '';

    // Button borders
    if (i === middle-1 || i === middle+1) {
      row += Array(Math.round(columns/2)-bLength).fill(' ').join('');

      buttons.forEach(b => {
        row += '+' + Array(b.length+2).fill('-').join('') + '+ ';
      });
    }

    // Button itself
    if (i === middle) {
      row += Array(Math.round(columns/2)-bLength).fill(' ').join('');

      buttons.forEach((b, x) => {
        if (selected === x) b = chalk.bgRed(b);

        row += '| ' + b + ' | ';

        b = chalk.reset(b);

        // Add button text position to mapping
        // The +4 is the border we need to compensate for
        buttonPos[x] = row.length - (b.length + 4);

        if (x === 0) {
          // I honestly don't know why I need +6
          buttonPos[x] = row.length - b.length + 6;
        }
      });
    }

    draw(row);
  }
}

function menuOptionSelect(buttons, selected) {
  const middle = Math.round(rows/2)+1;

  // Iterate positions
  Object.keys(buttonPos).forEach((b) => {
    const pos = buttonPos[b];

    // Re-position cursor
    process.stdout.write(POSITION(pos, middle));

    // Write a backgrounded version of the menu text if we are selected, otherwise regular
    if (selected == b) replace(chalk.bgRed(buttons[b]));
    else {
      replace(buttons[b]);
    }
  });

  // Reset
  process.stdout.write(POSITION(0, 0));
}