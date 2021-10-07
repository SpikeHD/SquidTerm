const menu = require('./menu');

const buttons = ['Play', 'Exit'];

module.exports = async () => {
  await menu.init(buttons, controller);
};

function controller(key, selected) {
  // Menu controller
  switch (key) {
  case 'right':
    selected++;

    if (selected > buttons.length - 1) selected = 0;
    break;

  case 'left':
    selected--;

    if (selected < 0) selected = buttons.length - 1;
    break;

  case 'enter':
    return menuHandle(selected);

  case 'escape':
    process.exit();
    break;
  }

  return selected;
}

function menuHandle(selected) {
  const option = buttons[selected];

  switch(option) {
  case 'Music Select':
    return false;
    
  case 'Exit':
    process.exit();
  }
}