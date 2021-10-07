const keymap = {
  279168: 'left',
  279165: 'up',
  279167: 'right',
  279166: 'down',
  13: 'enter',
  27: 'escape'
};

module.exports = async () => {
  process.stdin.setRawMode(true);
  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data];
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C');
      process.exit(1);
    }
    process.stdin.setRawMode(false);
    resolve(keymap[byteArray.join('')] || Buffer.from(byteArray).toString());
  }));
};